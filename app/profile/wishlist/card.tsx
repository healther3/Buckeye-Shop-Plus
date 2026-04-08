import Image from "next/image";
import Link from 'next/link';
import { Product } from "@/app/lib/definitions";
import {DeleteCartItem} from '@/app/ui/Button'
import {fetchProductByWLId} from '@/app/lib/data'
import { WishListItem } from "@/app/lib/definitions";

export default async function Card({ item }: {item : WishListItem}) {
  
  const products = await fetchProductByWLId(item.product_id) ?? [];
  const product = products[0];

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center space-y-3">
      <Link href={`/products/${product.id}`} >
        <div className="w-28 h-28 relative">
          <Image
            src={product.url}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="font-semibold text-lg">{product.name}</div>
        <div className="text-gray-700">${product.price}</div>
      </Link>
      <DeleteCartItem id={item.id}></DeleteCartItem>
      
    </div>
  );
}