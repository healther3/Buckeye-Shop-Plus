'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { randomUUID } from 'crypto';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import Categories from '../categories/page';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { can } from '@/app/lib/auth-helpers';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const CATEGORIES = ['clothing', 'furniture', 'electronics', 'beauty', 'snacks'] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const cleanPhoneNumber = (val: string) => val.replace(/[^\d+]/g, '');

const s3Client = new S3Client({
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string().min(5, {message : 'Please enter a name with at least 5 characters.'}),
    email: z.string().email({message : 'Please enter email'}),
    password: z.string().min(6, {message : 'Please enter password with at least 6 characters.'}),
    date: z.string(),
});

const EditUserAvatarSchema = z.object({
    image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if(!file || file.size === 0) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      'Max file size is 5MB.'
    )
    .refine(
      (file) => {
        if (!file || file.size === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const ProductFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {message : 'Please enter a name with at least 1 characters.'}),
  stock: z.coerce.number().gt(0, {message : 'Please enter a number greater than 0.'}),
  category: z.enum(CATEGORIES, { message: 'Please select a valid category.' }),
  price: z.coerce.number().gt(0, {message : 'Please enter a number greater than 0.'}),
  date: z.string(),
  image: z
    .any()
    .refine((file) => file?.size > 0, "Image is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const EditProductFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {message : 'Please enter a name with at least 1 characters.'}).optional(),
  stock: z.coerce.number().gt(0, {message : 'Please enter a number greater than 0.'}).optional(),
  category: z.enum(CATEGORIES, { message: 'Please select a valid category.' }).optional(),
  price: z.coerce.number().gt(0, {message : 'Please enter a number greater than 0.'}).optional(),
  date: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if(!file || file.size ===0) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      'Max file size is 5MB.'
    )
    .refine(
      (file) => {
        if (!file || file.size === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const CommentFormSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    product_id: z.string(),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().trim().optional(),
    date: z.string(),
});

const UserAddressFormSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().optional(),
    label: z.string().min(1, {message: 'please enter address label(home, company, eg.)'}),
    recipient_name: z.string().min(1, {message: 'please enter recipient name'}),
    phone_number: z.string()
        .min(8, { message: 'please enter valid phone number' })
        .max(30, { message: 'this phone number is too long' })
        .transform(cleanPhoneNumber)
        .refine(
            (val) => {
                const digits = val.startsWith('+') ? val.substring(1) : val;
                return /^\+?\d+$/.test(val) && digits.length >= 8 && digits.length <= 15;
            },
            { message: 'please enter the phone number with correct format' }
        ),    state: z.string(),
    city: z.string().min(1, {message: 'please enter the city name'}),
    zip_code: z.string().min(3).optional(),
    street_address_1: z.string().min(5,{message: 'please enter the street address'}),
    street_address_2: z.string().optional(),
    is_default: z.boolean().default(false),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
})

const CreateUser = UserFormSchema.omit({id: true, date: true});
const UpdateUserPassword = UserFormSchema.omit({id: true, name: true, email:true, date:true});
const UpdateUserAvatar = EditUserAvatarSchema.omit({});
const CreateProduct = ProductFormSchema.omit({id: true, date: true});
const UpdateProduct = EditProductFormSchema.omit({id: true, date: true});
const CreateComment = CommentFormSchema.omit({id: true, user_id: true, product_id: true, date:true});
const CreateUserAddress = UserAddressFormSchema.omit({id: true, user_id:true});

export type UserState = {
  errors?: {
    name?: string[];
    email?:string[];
    password?:string[];
    image?:string[];
  };
  message:string;
};

export type ProductState = {
  errors?: {
    name?: string[];
    stock?: string[]; 
    category?: string[];
    price?:string[];
    image?:string[];
  };
  message:string;
}

export type CommentState = {
  errors?:{
    rating?: string[];
    comment?: string[];
  }
  message:string;
}

export type UserAddressState = {
  errors?:{
    label?: string[];
    recipient_name?: string[];
    phone_number?: string[];
    state?: string[];
    city?: string[];
    zip_code?: string[];
    street_address_1?: string[];
    street_address_2?: string[];
    is_default?: string[];
    latitude?:string[];
    longitude?:string[];
  }
  message: string;
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
){
  try{
    await signIn('credentials',{
      ...Object.fromEntries(formData), 
      redirectTo: '/', 
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials';
        default:
          return 'Something went wrong.';
      }
    }
      throw error;
  }
}

//#region User Actions

export async function createUser(prevState: UserState, formData: FormData){

    const validatedFields = CreateUser.safeParse(
        {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
        }
    );

    if(!validatedFields.success){
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create User.'
      };
    }

    const {name, email, password} = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomUUID();

  try{
    await sql`
    INSERT INTO users (id, name, email, password, create_date)
    VALUES (${id}, ${name}, ${email}, ${hashedPassword},${date})`;

    await sql`
   INSERT INTO user_roles (user_id, role_id)
    SELECT 
    ${id},
    r.id AS role_id
    FROM 
    roles r
    WHERE 
    r.type = 'member'
    `;

  } catch(error : any) {
    if (error.code === '23505') {
          return {
            errors: {
                email: ['this email has been used']
            },
            message: 'failed to create User'
        };
    }
    console.error('database error', error); 
    return {
      message :'database error: failed to create User'
    };
  }

  redirect('/login');
}

export async function updateUserPassword(id: string, prevState: UserState, formData: FormData) {
  const validatedFields = UpdateUserPassword.safeParse(
        {
          password: formData.get('password'),
        }
    );

    if(!validatedFields.success){
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'validate data failed'
      };
    }

    const { password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

  try{ 

    await sql`
        UPDATE users
        SET password = ${hashedPassword}
        WHERE id = ${id}
      `;
  } catch(error) {
    console.error('database error', error);
    return{
      message: 'datbase error: failed to change user password'
    };
  }
   revalidatePath('/profile');
   redirect('/');
  return {
    message: 'Password updated successfully!',
    errors: {}
  }
}


export async function updateUserAvatar(id: string, prevState: UserState, formData: FormData)
{
    const rawImage = formData.get('image') as File;
    const systemAvatar = formData.get('systemAvatar') as string;

        if (systemAvatar && systemAvatar.trim() !== '') {
        try {
        await sql`UPDATE users
          SET image_url = ${systemAvatar}
          WHERE id = ${id}
        `;
        
      } catch(error) {
        console.error('Database Error:', error);
        return {
          message: 'System error: Failed to update avatar.',
          errors: {}
        }
      }
    } else {

        const validatedFields = UpdateUserAvatar.safeParse(
        {
          image: (rawImage && rawImage.size > 0) ? rawImage : undefined,
        }
      );
      
        if(!validatedFields.success) {
          return{
          errors: validatedFields.error.flatten().fieldErrors, 
          message: 'Missing Fields. Failed to Update Avatar.'
          }
        }

        const file = formData.get("image") as File;

        try{
    let imageUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    }

      await sql `UPDATE users
      SET image_url = ${imageUrl!}
      WHERE id = ${id}
      `;

  }catch(error) {
      console.error('Database/S3 Error:', error);
    return {
      message: 'System error: Failed to upload avatar.',
    }
  }
}
    revalidatePath('/profile');
    redirect(`/profile`);
}

//#endregion

//#region comments

export async function createComment(user_id: string, product_id: string, prevState: CommentState, formData: FormData) {
    const session = await auth();

    if (!can(session, 'create_comment')) {
        return {
        message: 'Permission denied: You cannot create comments.',
        error: 'PERMISSION_DENIED'
      };
    }
    
    const validatedFields = CreateComment.safeParse(
        {
          rating: formData.get("rating"),
          comment: formData.get("comment"),
        }
    );  

      if(!validatedFields.success){
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Comment.'
        };
      }

    const {comment, rating} = validatedFields.data;

      try{
    await sql`
    INSERT INTO comments (user_id, product_id, rating, comment)
    VALUES (${user_id}, ${product_id}, ${rating}, ${comment ?? null})`;
  } catch(error){
    console.error('database error', error); 
    return {
      message :'database error: failed to create Comment!'
    };
  }
    revalidatePath(`/products/${product_id}`);
    redirect(`/products/${product_id}`);
}

//#endregion


//#region Product Actions
export async function createProduct(prevState: ProductState, formData: FormData){
    const session = await auth();

    if (!can(session, 'create_product')) {
        return {
        message: 'Permission denied: You cannot create product.',
        error: 'PERMISSION_DENIED'
      };
    }

    const validatedFields = CreateProduct.safeParse(
        {
            name: formData.get('name'),
            stock: formData.get('stock'),
            category: formData.get('category'),
            price: formData.get('price'),
            image: formData.get('image'),
        }
    );

    if(!validatedFields.success){
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Product.'
      };
    }

    const {name, stock, category, price, image} = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
    const id = randomUUID();

  try{
    const file = image as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME, 
      Key: filename,                       
      Body: buffer,                        
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

  await sql`
  INSERT INTO products (id, name, stock, category, price, create_date, url)
  VALUES (${id}, ${name}, ${stock}, ${category},${price}, ${date},${imageUrl})`;

  } catch(error) {
    console.error('database error', error); 
    return {
      message :'database error: failed to create User'
    };
  }
  redirect('./success');
}

export async function updateProduct(id: string, prevState: ProductState, formData: FormData) {
    const session = await auth();

    if (!can(session, 'update_product')) {
        return {
        message: 'Permission denied: You cannot update product.',
        error: 'PERMISSION_DENIED'
      };
    }
    const rawImage = formData.get('image') as File;
    const validatedFields = UpdateProduct.safeParse(
        {
            name: formData.get('name') || undefined,
            stock: formData.get('stock') || undefined,
            category: formData.get('category') || undefined,
            price: formData.get('price') || undefined,
            image: (rawImage && rawImage.size > 0) ? rawImage : undefined,       
        }
    );

    if(!validatedFields.success) {
      return{
        errors: validatedFields.error.flatten().fieldErrors, 
        message: 'Missing Fields. Failed to Update Product.'
      }
    }

    const{name, stock, category, price} = validatedFields.data;
    const file = formData.get("image") as File;


    try{
    let imageUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    }

    const rawUpdateData = {
      name,
      stock,
      category,
      price,
      url: imageUrl, 
    };

    const updateData = Object.fromEntries(
      Object.entries(rawUpdateData).filter(([_, v]) => v != null)
    );

    if (Object.keys(updateData).length > 0) {
      await sql`
        UPDATE products
        SET ${sql(updateData)}
        WHERE id = ${id}
      `;
    }
  } catch(error) {
      return { 
      message: 'database error: Failed to update Product'
        };
    }
    revalidatePath('/');
    revalidatePath('/categories');
    redirect('/');
    
}

export async function deleteProduct(id: string) {
  const session = await auth();

    if (!can(session, 'delete_product')) {
        return {
        message: 'Permission denied: You cannot delete product.',
        error: 'PERMISSION_DENIED'
      };
    }

  try{
  await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/categories');
    } catch(error) {
    console.error('database error', error);
    return{
      message: 'database error: failed to delete product'
    };
  }
}

export async function deleteComment(id: string) {
  let product_id;
  const session = await auth();

    if (!can(session, 'delete_comment')) {
        return {
        message: 'Permission denied: You cannot delete comments.',
        error: 'PERMISSION_DENIED'
      };
    }

  try{
    const result = await sql`
        SELECT product_id FROM comments WHERE id = ${id}
    `;

    const productRow = result.at(0);
    if (!productRow) {
        throw new Error(`Comment with ID ${id} not found.`);
    }
    product_id = productRow.product_id;
        await sql`
        DELETE FROM comments WHERE id = ${id}
    `;

    revalidatePath(`/products/${product_id}`);
    redirect(`/products/${product_id}`);

    } catch(error) {
    console.error('database error', error);
    return{
      message: 'database error: failed to delete product'
    };
  }

}

export async function deleteUser(id: string) {
try{
  await sql`DELETE FROM users WHERE id = ${id}`;
  } catch(error) {
    console.error('database error', error);
    return{
      message: 'database error: failed to delete user'
    };
  }}

const WishListSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  product_id: z.uuid(),
  quantity: z.number(),
  create_date: z.date(),
});

const WishList = WishListSchema.omit({id: true, create_date: true});

export async function addToWishList(user_id: string, product_id: string, quantity: number){
  const session = await auth();

    if (!can(session, 'add_to_wishlist')) {
        return {
        message: 'Permission denied: You cannot add to wishlist.',
        error: 'PERMISSION_DENIED'
      };
    }
  const valid = WishList.safeParse({user_id, product_id, quantity});

  if(!valid.success){
    console.log("Wishlist validation failed:", valid.error);
    return {
      error: valid.error.flatten().fieldErrors,
      message: "invalid data for wishlist"
    }
  }

  try {
    await sql`
      INSERT INTO wish_list(user_id, product_id, quantity)
      VALUES (${user_id}, ${product_id}, ${quantity})
    `;
  } catch (error) {
    console.error('failed adding to wish_list', error);
  }
  return
}

export async function isInWishList(user_id: string, product_id: string){
  try {
    const item = await sql`
    SELECT 1 FROM wish_list WHERE product_id = ${product_id} AND user_id = ${user_id}
    `
    const exists = item.length > 0;
    if (exists) {
      console.log(`Product with ID ${product_id} is in the database.`);
    } else {
      console.log(`Product with ID ${product_id} was NOT found.`);
    }
    return exists;
  } catch (error) {
    console.error("error finding product in wish list", error);
  }
}

export async function deleteListItem(id: string){
  const session = await auth();

    if (!can(session, 'remove_from_wishlist')) {
        return {
        message: 'Permission denied: You cannot delete list item.',
        error: 'PERMISSION_DENIED'
      };
    }
  await sql`
    DELETE FROM wish_list WHERE id = ${id};
  `;
  revalidatePath("/profile/wishlist");
  revalidatePath("/profile");
}

//#region user address
export async function createUserAddress(user_id: string, prevState: UserAddressState, formData: FormData)
{
    const validatedFields = CreateUserAddress.safeParse(
        {
            label: formData.get('label'),
            recipient_name: formData.get('recipient_name'),
            phone_number: formData.get('phone_number'),
            state: formData.get('state'),
            city: formData.get('city'),
            zip_code: formData.get('zip_code'),
            street_address_1: formData.get('street_address_1'),
            street_address_2: formData.get('street_address_2'),
            is_default: formData.get('is_default'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
        }
    );

    if(!validatedFields.success){
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Address.'
      };
    }

    const {label, recipient_name, phone_number, state, city, zip_code, street_address_1, street_address_2, is_default: rawIsDefault, latitude, longitude} = validatedFields.data;
    const latValue = latitude ? parseFloat(latitude) : null;
    const lngValue = longitude ? parseFloat(longitude) : null;

    try{
        if (rawIsDefault) {
        await sql`
            UPDATE user_address
            SET is_default = false
            WHERE user_id = ${user_id}
        `;
        }

        await sql`
        INSERT INTO user_address (user_id, label, recipient_name, phone_number, state, city, zip_code, street_address_1, street_address_2, is_default)
        VALUES (${user_id}, ${label}, ${recipient_name}, ${phone_number},
        ${state}, ${city},${zip_code??null},${street_address_1},${street_address_2??null},
        ${rawIsDefault??false},${latValue ?? null},${lngValue ?? null})`;
    }catch(error) {
      console.error('database error', error); 
        return {
        message :'database error: failed to create User Address'
      };        

    }

      redirect('/profile');
}

//#endregion