// next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      createDate: string;
      imageUrl:string;
      permissions:string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    createDate: string;
    imageUrl:string;
    permissions:string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    createDate: string;
    imageUrl:string;
    permissions:string[];
  }
}