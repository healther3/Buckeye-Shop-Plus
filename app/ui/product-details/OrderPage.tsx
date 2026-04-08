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
        <div className="bg-white text-gray-900 min-h-screen p-8 flex justify-center items-start">
            <div className="w-full max-w-lg p-8 space-y-6 border border-gray-200 rounded-lg shadow-xl bg-gray-50">
                
                <h1 className="text-3xl font-extrabold text-gray-800 border-b border-gray-300 pb-2">
                    🛒 Order Summary
                </h1>

                <div className="text-lg space-y-2">
                    <p><strong>Product:</strong> <span className="font-semibold text-gray-900">{product.name}</span></p>
                    <p><strong>Category:</strong> {product.category}</p>
                   
                    <p><strong>Unit Price:</strong> <span className="font-semibold text-red-700">${numericPrice.toFixed(2)}</span></p>
                    <p>
                        <strong>Stock Remaining:</strong> 
                        <span className={maxStock > 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {maxStock}
                        </span>
                    </p>
                </div>
                
                <div className="pt-4 border-t border-gray-300">
        
                    <label htmlFor="quantity-input" className="block text-xl font-bold mb-3 text-gray-700">Select Quantity:</label>
                    <div className="flex items-center space-x-3">
                        
                        <button 
                            onClick={decrement}
                            disabled={!isOrderReady || quantity <= 1}
                        
                            className={`flex justify-center items-center p-3 text-xl font-bold rounded-full w-12 h-12 transition ${
                                !isOrderReady || quantity <= 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-red-700 text-white hover:bg-red-600' 
                            }`}
                        >
                            -
                        </button>
                        
                        <input 
                            id="quantity-input"
                            onChange={handleChange} 
                            type="number" 
                            max={maxStock} 
                            min={maxStock > 0 ? 1 : 0} 
                            value={quantity}
                            disabled={!isOrderReady}
                         
                            className="w-20 text-center p-3 text-xl font-bold rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-700 bg-white border border-gray-300"
                        />
                        
                        <button 
                            onClick={increment}
                            disabled={!isOrderReady || quantity >= maxStock}
                            
                            className={`p-3 text-xl font-bold rounded-full w-12 h-12 flex justify-center items-center transition ${
                                !isOrderReady || quantity >= maxStock
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-red-700 text-white hover:bg-red-600' 
                            }`}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="text-2xl font-extrabold text-right pt-4 border-t border-gray-300">
                    
                    <p>Total: <span className="text-red-700">${totalPrice}</span></p>
                </div>

                <div className="mt-6 flex justify-between space-x-4">
                    
                    {/* Cancel Button */}
                    <Link href={`/products/${id}`} className="flex-1">
                 
                        <button
                            className="w-full px-4 py-3 font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition shadow-md"
                        >
                            Cancel
                        </button>
                    </Link>
                    
                    {/* Confirm Purchase Button */}
                    <button
                        
                        className={`flex-1 px-4 py-3 font-semibold rounded-lg transition shadow-lg ${
                            isOrderReady 
                                ? 'bg-red-700 text-white hover:bg-red-600 shadow-red-500/50' 
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={!isOrderReady}
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}