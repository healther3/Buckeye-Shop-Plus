'use client'
import {createProduct, ProductState} from '@/app/lib/actions'
import { useActionState, useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePermissions } from '../lib/hooks/use-permission';

export default function CreateProductForm(){
    const { hasPermission } = usePermissions();
    const canCreateProduct = hasPermission('create_product'); 
    
    if(!canCreateProduct)
    {
      return (<div className="bg-white text-gray-900 min-h-screen p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h3 className="text-gray-900 font-semibold mb-2">You don't have the permission to create product</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    ask admin for more information
                </p>
            </div>
            </div>
            );
    }
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const initialState : ProductState = {message : '', errors:{}};
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setErrorMsg('');
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file) {
        if (file.size > MAX_SIZE)
        {
          setErrorMsg('please up load a file with size less than 1MB');
          e.target.value = '';
          return;
        }
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    };

    useEffect(() => {
      return () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    return(
      <div className="min-h-screen w-full bg-white p-4 md:p-8">
        <form action={formAction} className="space-y-3">
          <div className="mx-auto max-w-7xl rounded-2xl bg-gray-50 px-8 py-10 shadow-sm md:px-16">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">Create Product</h1>
            
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24">
              
              <div className="flex flex-col">
                <label htmlFor="image" className="mb-2 block text-sm font-medium">
                  Product Image
                </label>
                
                <div className="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm transition-colors hover:border-gray-400">
                  {previewUrl ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 group">
                      {previewUrl.startsWith('/') || previewUrl.startsWith('http') || previewUrl.startsWith('blob:') ? (
                        <>
                          <Image 
                            src={previewUrl} 
                            alt="Preview" 
                            fill 
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </>
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
                          {previewUrl}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-center text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image selected</p>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="font-semibold text-gray-700">Upload Product Image</p>
                    <p className="text-sm text-gray-500 mb-4">Select an image file to upload</p>
                    <div className="relative">
                      <input
                        type="file" 
                        id="image" 
                        name="image" 
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="peer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        required
                      />
                    </div>
                  </div>
                </div>

                <div id="file-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.image && 
                    state.errors.image.map((error: string) => (
                      <p key={error} className="mt-2 text-sm text-red-500">
                        {error}
                      </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                
                {/* 1. Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Product Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Enter product name" 
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name && 
                      state.errors.name.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                    ))}
                  </div>
                </div>

                {/* 2. Stock */}
                <div className="mb-4">
                  <label htmlFor="stock" className="mb-2 block text-sm font-medium">
                    Stock
                  </label>
                  <input 
                    type="number" 
                    id="stock" 
                    name="stock" 
                    placeholder="0" 
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <div id="stock-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.stock && 
                      state.errors.stock.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                    ))}
                  </div>
                </div>

                {/* 3. Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="mb-2 block text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category" 
                    name="category" 
                    defaultValue=""
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                    required
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    <option value="clothing">Clothing</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="beauty">Beauty & Cosmetics</option>
                    <option value="snacks">Food & Drinks</option>
                  </select>
                  <div id="category-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.category && 
                      state.errors.category.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                    ))}
                  </div>
                </div>

                {/* 4. Price */}
                <div className="mb-4">
                  <label htmlFor="price" className="mb-2 block text-sm font-medium">
                    Price ($)
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    name="price" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <div id="price-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.price && 
                      state.errors.price.map((error: string) => (
                        <p key={error} className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                    ))}
                  </div>
                </div>

                {/* Global Message */}
                {state.message && (
                  <p className="mt-2 text-sm text-red-500 font-bold">{state.message}</p>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <Link
                    href="/"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
                  >
                    {isPending ? 'Adding Product...' : 'Add Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
}

// 'use client'
// import {createProduct, ProductState} from '@/app/lib/actions'
// import { useActionState,useState } from "react";
// import Link from 'next/link';
// import Image from 'next/image';


// export default function CreateProductForm(){
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//     const initialState : ProductState = {message : null, errors:{}};
//     const [state, formAction, isPending] = useActionState(createProduct, initialState);

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewUrl(objectUrl);
//     } else {
//       setPreviewUrl(null);
//     }
//   };
//     return(
//         <form action={formAction}>
//             <label htmlFor="name">Product Name:</label><br/>
//             <input type="text" id="name" name="name" placeholder="Enter product name" required/><br/>
//             <div id="name-error" aria-live="polite" aria-atomic="true">
//                 {state.errors?.name && 
//                   state.errors.name.map((error: string) => (
//                     <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
//                       {error}
//                     </p>
//                 ))}
//             </div>

//             <label htmlFor="stock">Stock:</ label><br/>
//             <input type="number" id="stock" name="stock" placeholder="0" required/><br/>
//             <div id="stock-error" aria-live="polite" aria-atomic="true">
//                 {state.errors?.stock && 
//                   state.errors.stock.map((error: string) => (
//                     <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
//                       {error}
//                     </p>
//                 ))}
//             </div>

//             <label htmlFor="category">Categories:</label><br/>
//             <select
//                 id="category" name="category" defaultValue={""} required
//             >
//             <option value="" disabled>
//               Select a category...
//             </option>
//             <option value="clothing">Clothing</option>
//             <option value="furniture">Furniture</option>
//             <option value="electronics">Electronics</option>
//             <option value="beauty">Beauty & Cosmetics</option>
//             <option value="snacks">Food & Drinks</option>
//             </select>

//             <div id="category-error" aria-live="polite" aria-atomic="true">
//                 {state.errors?.category && 
//                   state.errors.category.map((error: string) => (
//                     <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
//                       {error}
//                     </p>
//                 ))}
//             </div>

//             <label htmlFor="price">Price:</label><br/>
//             <input type="number" id="price" name="price" step="0.01" placeholder="0.00" required/><br/>
//             <div id="price-error" aria-live="polite" aria-atomic="true">
//                 {state.errors?.price && 
//                   state.errors.price.map((error: string) => (
//                     <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
//                       {error}
//                     </p>
//                 ))}
//             </div>

//             <label htmlFor="image">Upload Image:</label><br/>
//             <div className="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm transition-colors hover:border-gray-400">
//                         {previewUrl && (
//                       <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg bg-gray-100 border border-gray-200 grou">
//                     {previewUrl.startsWith('/') || previewUrl.startsWith('http') || previewUrl.startsWith('blob:') ? (
//                         <>
//                     <Image 
//                       src={previewUrl} 
//                       alt="Current" 
//                       fill 
//                       className="h-full w-full object-cover"
//                       unoptimized
//                     />
//                     <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
//                   </>
//                 ) : (
//                   <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
//                     {previewUrl}
//                   </div>
//                       )}
//                 </div>
//                         )}
//             </div>
//             <input
//              type="file" id="image" name="image" accept="image/png, image/jpeg, image/webp"
//             onChange={handleImageChange}
//             className="peer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
//              required/><br/>
//             <div id="file-error" aria-live="polite" aria-atomic="true">
//                 {state.errors?.image && 
//                   state.errors.image.map((error: string) => (
//                     <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
//                       {error}
//                     </p>
//                 ))}
//             </div>

//             <Link
//                 href="/"
//                 className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//             >
//             Cancel
//             </Link>

//             <button type="submit" disabled={isPending}>
//                 {isPending ? 'Adding Product...' : 'Add product'}
//             </button>
//         </form>
//     );
// }