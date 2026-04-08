export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createDate: string;
  imageUrl:string;
  permissions:string[];
};

export enum Category {
  Clothing = "clothing",
  Furniture = "furniture",
  Electronics = "electronics",
  Cosmetics = "cosmetics",
  Snacks = "snacks"
}

export type Product = {
    id: string;
    name: string;
    stock: string;
    category: Category;
    price: number;
    createDate: string;
    url: string;
}

export type Admin = {
    id: string;
    name: string;
    email: string;
    password: string;
    createDate: string;
}

export type Comment = {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment:  string;
    create_data: string;
    users: User | null;
}

export type WishListItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
}

export type UserAddress = {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone_number: string;
  state: string;
  city: string;
  zip_code: string;
  street_address_1: string;
  street_address_2?: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
}