'use client';

import { updateProduct, ProductState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { Product } from '@/app/lib/definitions'; 

export default function EditProductForm({ product }: { product: Product }) {
  const initialState: ProductState = { message: '', errors: {} };
  
  const updateProductWithId = updateProduct.bind(null, product.id);  
  const [state, formAction, isPending] = useActionState(updateProductWithId, initialState);

  const [previewUrl, setPreviewUrl] = useState<string | null>(product.url || null);

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(product.url || null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 md:p-8">

    <form action={formAction} className="space-y-3">
      <div className="mx-auto max-w-7xl rounded-2xl bg-gray-50 px-8 py-10 shadow-sm md:px-16">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Product</h1>
        {/* 5. Image */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24">
        <div className="flex flex-col">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Product Image
          </label>
          
          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm transition-colors hover:border-gray-400">
            {previewUrl && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 group">
        {previewUrl.startsWith('/') || previewUrl.startsWith('http') || previewUrl.startsWith('blob:') ? (
            <>
        <Image 
          src={previewUrl} 
          alt="Current" 
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
            )}

                   
                   
                <div className="text-center">
                <p className="font-semibold text-gray-700">Current Image</p>
                <p className="text-sm text-gray-500 mb-4">Upload a new file to replace it, or leave empty to keep.</p>
                <div className="relative">
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            className="peer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
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
            id="stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
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
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            defaultValue={product.category}
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
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
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
            {isPending ? 'Updating...' : 'Update Product'}
          </button>
          </div>
        </div>
        </div>
      </div>
    </form>
    </div>
  );
}