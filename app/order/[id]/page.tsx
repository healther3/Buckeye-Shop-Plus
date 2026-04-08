import Link from 'next/link'
import postgres from "postgres";
import { fetchProduct } from '@/app/lib/data';
import OrderPage from '@/app/ui/product-details/OrderPage';

export default async function Order(props: { params: Promise<{ id: string }> }){
    const {id} = await props.params;
    const product = await fetchProduct(id);
    if(product.length===0){
        return <h1>product not found</h1>
    }
    const {name, price, stock, category, createDate, url} = product[0];
  return (
    <OrderPage 
        id={id}
        name={name}
        price={price}
        stock={stock}
        category={category}
        createDate={createDate}
        url={url}>
    </OrderPage>
            
  );
}