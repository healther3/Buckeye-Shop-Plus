import postgres from 'postgres'
import { unstable_noStore as noStore } from 'next/cache';
import { Product, User, Comment, WishListItem } from './definitions'
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 32;
const COMMENT_PER_PAGE = 12;

export async function fetchUsers(){
    try {
        const users = await sql <User[]> `SELECT * FROM users`;
        return users;
    } catch (error) {
        console.error('error fetching users', error);
        throw new Error('Failed to fetch USER.');
    }
}

export async function fetchUserByAuthUser() {
  const session = await auth();
  if(!session?.user?.email) {
    throw new Error('current session does not have user.'); 
  }
  const { email } = session.user;

  try {
      const user = await sql<User[]> 
      `SELECT 
      id, 
      name, 
      email,
      create_date AS "createData",
      image_url AS "imageUrl"
      FROM users
      WHERE email = ${email};`
      return user[0] || null;
  } catch (error)
  {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user from database.');
  }
}


export async function fetchProducts(currentPage: number, query: string) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const products = await sql<Product[]> `
          SELECT * FROM products
          WHERE name ILIKE ${`%${query}%`}
          ORDER BY id DESC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        return products;
    } catch (error) {
        console.error('error fetching products', error);
        throw new Error('Failed to fetch products.');
    }
}
    
export async function fetchProductsByCategory(category: string, currentPage: number, query: string) {
  noStore(); 
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<Product[]> `
      SELECT * FROM products
      WHERE category = ${category}
      AND name ILIKE ${`%${query}%`}
      ORDER BY id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return products;
  } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products.');
  }
}


export async function fetchProductsPage(query: string) {
    noStore();
    try {
    const count = await sql`
      SELECT COUNT(*) FROM products
      WHERE name ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product total pages.');
  }
}

export async function fetchProductsPagesByCategory(category: string, query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*) FROM products 
      WHERE category = ${category}
      AND name ILIKE ${`%${query}%`}
    `;
    
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product total pages.');
  }
}


export async function fetchProduct(id: string){
  try {
    const product = await sql<Product[]> `
        SELECT * FROM products WHERE id = ${id}
    `
    return product;
  } catch (error) {
  console.error('Database Error:', error);
  throw new Error('Failed to fetch product.');
  }
}

export async function fetchWishList(id: string){
  try {
    const list = await sql<WishListItem[]>`
    SELECT * FROM wish_list WHERE user_id = ${id}
    `
    return list
  } catch (error) {
    console.error("database error: ", error)
  }
}

export async function fetchProductByWLId(id: string){
  try {
    const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if(!product) console.log("no product found");
    return product;
  } catch (error) {
    console.error("error fetching product from the wish list", error);
  }
}

export async function fetchCommentPageByProduct(product_id: string){
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*) FROM comments 
      WHERE product_id = ${product_id}
    `;
    
    const totalPages = Math.ceil(Number(count[0].count) / COMMENT_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch comments total pages.');
  }
}

export async function fetchComments(product_id: string, currentPage: number) {
  noStore(); 
  const offset = (currentPage - 1) * COMMENT_PER_PAGE;

  try {
    const comments = await sql<Comment[]> `
      SELECT 
        c.*, 
        json_build_object(
          'name', u.name,
          'imageUrl', u.image_url
        ) as users
      FROM comments c
      JOIN users u ON c.user_id = u.id  
      WHERE c.product_id = ${product_id}
      ORDER BY c.create_date DESC 
      LIMIT ${COMMENT_PER_PAGE} OFFSET ${offset}
    `;
    return comments;
  } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch comments.');
  }
}

export async function fetchProductIdByCommentId(comment_id: string) {

  try{
      const comment = await sql<Comment[]> `
        SELECT * FROM comments WHERE id = ${comment_id}
    `
    return comment[0].product_id;
  }  catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch product id by comment.');
  }
}