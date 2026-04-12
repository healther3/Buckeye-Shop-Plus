'use client'
import Link from 'next/link'
import { Product } from '@/app/lib/definitions';
import { useParams } from 'next/navigation';
import {useState, useEffect} from 'react'

export default function OrderPage( product : Product) {
    
    const maxStock = Number(product.stock); 
    const [quantity, setQuantity] = useState<number>(1); 

    useEffect(() => {
        if (maxStock < 1) {
            setQuantity(0);
        } else {
            setQuantity(q => Math.min(q < 1 ? 1 : q, maxStock));
        }
    }, [maxStock]);

    const numericPrice = Number(product.price);
    const totalPrice = (numericPrice * quantity).toFixed(2);
    
    function increment() {
        setQuantity((q) => Math.min(q + 1, maxStock));
    }

    function decrement() {
        setQuantity((q) => Math.max(q - 1, maxStock > 0 ? 1 : 0));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = Number(e.target.value);
        if (isNaN(value)) return;
        if (value < 1) value = maxStock > 0 ? 1 : 0; 
        if (value > maxStock) value = maxStock;
        setQuantity(value);
    }
    
    const params = useParams();
    const id = params.id;
    
    const isOrderReady = quantity > 0 && maxStock > 0;
    
    

    return(
        <main className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-300">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        🛒 Order Summary
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Review your purchase before confirming
                    </p>
                </div>

                <div className="space-y-4 text-sm text-gray-700 mb-8">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <span className="font-medium text-gray-500">Product</span>
                        <span className="font-bold text-gray-900">{product.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <span className="font-medium text-gray-500">Category</span>
                        <span className="text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <span className="font-medium text-gray-500">Unit Price</span>
                        <span className="font-bold text-red-700">${numericPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-500">Stock Remaining</span>
                        <span className={maxStock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                            {maxStock}
                        </span>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="quantity-input" className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</label>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={decrement}
                                disabled={!isOrderReady || quantity <= 1}
                                className={`flex justify-center items-center w-9 h-9 rounded-full transition-all duration-200 ${
                                    !isOrderReady || quantity <= 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-red-700 text-white hover:bg-red-600 shadow-sm active:scale-95' 
                                }`}
                            >
                                <span className="text-xl font-bold">-</span>
                            </button>
                            
                            <input 
                                id="quantity-input"
                                onChange={handleChange} 
                                type="number" 
                                max={maxStock} 
                                min={maxStock > 0 ? 1 : 0} 
                                value={quantity}
                                disabled={!isOrderReady}
                                className="w-12 text-center py-1 text-lg font-bold text-gray-900 border-b border-gray-200 focus:outline-none focus:border-red-700 bg-transparent"
                            />
                            
                            <button 
                                onClick={increment}
                                disabled={!isOrderReady || quantity >= maxStock}
                                className={`flex justify-center items-center w-9 h-9 rounded-full transition-all duration-200 ${
                                    !isOrderReady || quantity >= maxStock
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-red-700 text-white hover:bg-red-600 shadow-md active:scale-95' 
                                }`}
                            >
                                <span className="text-xl font-bold">+</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                    <span className="text-base font-bold text-gray-900">Total Price</span>
                    <span className="text-2xl font-extrabold text-red-700">${totalPrice}</span>
                </div>

                <div className="space-y-4">
                    <button
                        className={`w-full py-4 px-6 font-bold rounded-xl transition-all duration-200 shadow-lg ${
                            isOrderReady 
                                ? 'bg-red-700 text-white hover:bg-red-600 shadow-red-100 hover:shadow-red-200 active:scale-[0.98]' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isOrderReady}
                    >
                        Confirm Purchase
                    </button>
                    
                    <div className="text-center pt-2">
                        <Link 
                            href={`/products/${id}`} 
                            className="text-sm font-medium text-gray-500 hover:text-red-700 transition-colors"
                        >
                            Cancel and go back
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}