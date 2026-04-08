'use client'

import Link from 'next/link';  
import Image from 'next/image'; 
import { Product }from '../lib/definitions'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '../lib/actions';
import ProductDetails from './product-details/ProductDetails';
import { usePermissions } from '../lib/hooks/use-permission';

export default function ProductCard({product} : {product : Product})
{   
    const { session, hasPermission } = usePermissions();
    const canDeleteProduct = hasPermission('delete_product');
    const canUpdateProduct = hasPermission('update_product');

    const router = useRouter();
    const cardStyles = "group block p-10 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-center w-full md:w-64";
    const imageStyles = "aspect-square relative bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden";

    function handleEdit(e : React.MouseEvent)
    {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${product.id}/edit`);
    }

    async function handleDelete(e : React.MouseEvent)
    {
        e.preventDefault();
        e.stopPropagation();
        const confirmed = confirm('Delete the product?');
        if(!confirmed) return;
        await deleteProduct(product.id);  

    }
       return(
        <Link
            href={`/products/${product.id}`}
            className={cardStyles}
        >

        <div className="relative aspect-square mb-4 flex items-center justify-center">
        {
          <Image
            src={product.url}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        }

        {
          <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-10 backdrop-blur-sm">          
          <div className="flex gap-4">
            {/* Edit Button */}
            {canUpdateProduct &&
            (
            <button
              onClick={handleEdit}
              className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-110 transition-all shadow-sm"
              title="Edit"
            >
              <PencilIcon className="w-6 h-6" />
            </button>
            )}

            {/* Delete Button */}
             {canUpdateProduct &&
             (
            <button
              onClick={handleDelete}
              className="p-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
              title="Delete"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
             )}
          </div>
          </div>
        }
      </div>

        <h2 className={"text-2xl font-bold mb-2 text-gray-800 group-hover:text-red-700 transition-colors"}>
                {product.name}
        </h2>

        <p className="text-gray-500">
                {`$${Number(product.price).toFixed(2)}`}
        </p>
        </Link>
        );
}