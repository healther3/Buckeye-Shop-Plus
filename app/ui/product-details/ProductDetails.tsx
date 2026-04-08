'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { addToWishList, isInWishList } from "@/app/lib/actions";
import { inter } from "@/app/ui/fonts";
import { Button } from "@/app/ui/Button";



interface ProductDetailsProps {
    id: string;
    name: string;
    price: number; 
    stock: number;
    category: string;
    createDate: string; 
    url: string;
    isLoggedin: boolean;
    user_id: string;
    existsInWL: boolean;
}

export default function ProductDetails({
    id, 
    name, 
    price, 
    stock, 
    category, 
    createDate, 
    url,
    isLoggedin,
    user_id,
    existsInWL
}: ProductDetailsProps) {


    const formattedDate = new Date(createDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const isAvailable = Number(stock) > 0;
    const [isAdded, setIsAdded] = useState(existsInWL);

    const primaryColor = 'red-700';

    const addable = isLoggedin && isAvailable;

    function handleAddToCart(){
        setIsAdded(true);
        addToWishList(user_id, id, 1);
    }

    const cartbutton = () => {
        if(!isLoggedin) return <Link href="/login">{cartBtn}</Link>
        else if(isAdded) return <Button className={`px-6 py-3 font-semibold rounded-lg transition duration-150 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50`}>Added</Button>
        else if(isAvailable) return cartBtn
        else return <button>out of stock</button>
    }

    const cartBtn = (
        <Button 
            onClick={
                addable && !isAdded
                    ? handleAddToCart
                    : undefined
            }
            className={`px-6 py-3 font-semibold rounded-lg transition duration-150 ${
                isAvailable 
                    ? `bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-500/50 cursor-pointer` 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAvailable}
        >
            Add to Cart
        </Button> 
    );

    return (
        // 💡 Theme Change: White background, Dark text
        <div className="bg-white text-gray-900 min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* ❌ Removed Buckeye Shopping Header (Replaced with main title separator) */}
                <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 border-gray-300 pb-2">
                    Product Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Product Image using Next.js Image component */}
                    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl border border-gray-200">
                        <Image
                            src={url} 
                            alt={`Image of ${name}`} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

                        <div className={`${inter.className}text-lg space-y-2`}>
                            <p>
                                <strong className={`text-${primaryColor}`}>Category:</strong>
                                <span className="font-semibold"> {category} </span>
                            </p>
                            <p>
                                <strong className={`text-${primaryColor}`}>Price:</strong> 
                                <span className="font-semibold">${Number(price).toFixed(2)}</span>
                            </p>
                            <p>
                                <strong className={`text-${primaryColor}`}>Stock: </strong> 
                                <span className={isAvailable ? " font-semibold" : "text-red-500 font-semibold"}>
                                    {isAvailable ? `${stock}` : 'Out of Stock'}
                                </span>
                            </p>
                            <p>
                                <strong className={`text-${primaryColor}`}>Added on:</strong> <span className="font-semibold">{formattedDate}</span>
                            </p>
                            
                            {/* Product Source Link */}
                            <p>
                                <strong className={`text-${primaryColor}`}>Source Link: </strong> 
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:text-blue-500 underline break-all"
                                >
                                    View Source
                                </a>
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex space-x-4">
                            
                            {cartbutton()}
                            
                           <Link href={isLoggedin ? `/order/${id}` : `/login`}>
                                <Button 
                                    className={`px-6 py-3 font-semibold rounded-lg transition duration-150 ${
                                    isAvailable 
                                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-500/50' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={!isAvailable}
                                    >
                                    Buy Now
                                </Button>
                                </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}