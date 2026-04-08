import { fetchProducts, fetchProductsPage } from "../lib/data"; 
import Pagination from "../ui/pagination";
import ProductCard from "../ui/product-card";
import SearchBar from "@/components/SearchBar";

export default async function Categories(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {

  const searchParams = await props.searchParams;
  
  const query = searchParams.query || '';
  const currentPage = Number(searchParams.page) || 1;


  const totalPage = await fetchProductsPage(query);
  const products = await fetchProducts(currentPage, query);

  return (

    <div className="flex flex-col items-center w-full min-h-screen bg-white pb-10">
      
      {/* searchbar */}
      <div className="w-full max-w-xl mt-8 px-4">
        <SearchBar placeholder="Search all products..." />
      </div>

      {/* if nothing, notify */}
      {products.length === 0 && (
        <p className="text-gray-500 mt-20">No products found.</p>
      )}

      {/* product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-4 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* pages */}
      <div className="flex mt-12 justify-center w-full">
        <Pagination totalPages={totalPage} />
      </div>
    </div>
  );
}