import Link from "next/link";
import { auth, signOut } from '@/auth';
import { clsx } from 'clsx';
import SignOutButton from "./ui/sign-out-button";
import { fetchProducts } from "./lib/data";
import Image from "next/image";
import ProductCard from "./ui/product-card";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const isLoggedin = !!user;
  const cardStyles = "group block p-10 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-center w-full md:w-80";
  const products = await fetchProducts(1,'');
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* SECTION 1: Hero Section */}
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-20 px-6">
        
        {/* Header - Added buckeye red*/}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12 tracking-tight">
          Welcome to <span className="text-red-700">Buckeye Shopping!</span>
        </h1>

        {/* 
            grid-cols-1 (for phone) -> md:grid-cols-3 (for pc)
        */}
        <div className="flex flex-wrap justify-center  gap-8 w-full max-w-5xl">
          
          {/* Card 1: Login */}
          {!isLoggedin && (
          <Link
            href="/login"
            className={cardStyles}
          >
            <div className="text-5xl mb-4">👤</div>
            <h2 className={"text-2xl font-bold mb-2 text-gray-800 group-hover:text-red-700 transition-colors"}>
              Login
            </h2>
            <p className="text-gray-500">Access your account and start shopping!</p>
          </Link>
          )}

          {/* Card 2: Categories */}
          <Link
            href="/categories"
            className={cardStyles}
            >
            <div className="text-5xl mb-4">📁</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-red-700 transition-colors">
              Categories
            </h2>
            <p className="text-gray-500">Browse products by category.</p>
          </Link>

          {/* Card 3: Create Product */}
          {isLoggedin && (
          <Link
            href="/create-product"
            className={cardStyles}
          >
            <div className="text-5xl mb-4">🛍</div>
            <h2 className={"text-2xl font-bold mb-2 text-gray-800 group-hover:text-red-700 transition-colors"}>
              Add Product
            </h2>
            <p className="text-gray-500">Place a product for people to buy!</p>
          </Link>
          )}
        </div>
      </main>

      {/* SECTION 2: Product Showcase*/}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          <Link href="./categories" className="text-red-700 font-semibold hover:underline">
            View All &rarr;
          </Link>
        </div>

        {/* categories */}
        <div className="grid grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        </div>
      </section>
        
      {isLoggedin &&<SignOutButton/>}  
    </div>
  );
}