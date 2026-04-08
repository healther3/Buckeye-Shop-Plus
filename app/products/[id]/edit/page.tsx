import { fetchProduct } from "@/app/lib/data";
import ProductEditForm from "@/app/ui/product-edit-form"
import { notFound } from "next/navigation";

export default async function CreateProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const product = await fetchProduct(id);
    if(!product){
      notFound();
    }
  return (
    <main>
        <ProductEditForm product={product[0]}/>
    </main>
  );
}