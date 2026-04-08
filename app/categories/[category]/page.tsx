import { fetchProductsPagesByCategory, fetchProductsByCategory } from "@/app/lib/data";
import Pagination from "@/app/ui/pagination";
import Link from 'next/link';
import ProductCard from "@/app/ui/product-card";
import SearchBar from "@/components/SearchBar";

export default async function Page(props: {
    params:Promise<{category : string}>;
    searchParams: Promise<{page?: string; query?: string}>;}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams.page) || 1;
    const category = params.category;
    const query = searchParams.query || ''
   const totalPage = await fetchProductsPagesByCategory(category, query);
    const products = await fetchProductsByCategory(category, currentPage, query);

    return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pb-10">
            
            {/* put searchbar */}
            <div className="w-full max-w-6xl px-4 mt-8 flex justify-center">
                <SearchBar placeholder={`Search in ${category}...`} />
            </div>
      {/* notify if search product does not exist */}
            {products.length === 0 && (
        <p className="text-gray-500 mt-20">No products</p>
      )}
      {/* product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
      <div className="flex mt-12 justify-center w-full">
              <Pagination totalPages={totalPage} />
            </div>

              <div className="w-full max-w-6xl px-4 mt-6 flex gap-6 text-sm font-medium">
        <Link 
          href="./" 
          className="text-gray-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          <span>&larr;</span> Back to Categories
        </Link>
        <Link 
          href="/" 
          className="text-gray-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          <span>&larr;</span> Back to Homepage
        </Link>
      </div>
    </div>
  );
}