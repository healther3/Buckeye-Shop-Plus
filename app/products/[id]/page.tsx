import Link from 'next/link'
import { fetchCommentPageByProduct, fetchComments, fetchProduct } from '@/app/lib/data'
import ProductDetails from '@/app/ui/product-details/ProductDetails';
import {auth} from '@/auth';
import { isInWishList } from '@/app/lib/actions';
import CreateCommentForm from '@/app/ui/create-comment-form';
import CommentCard from '@/app/ui/comment-card';
import type {Comment} from '@/app/lib/definitions';
import Pagination from '@/app/ui/pagination';

export default async function ProductPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{page?: string; }>;}) {

    const session = await auth();
    const user = session?.user;
    const isLoggedin = !!user;
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams.page) || 1;

    const {id} = await props.params;
    const product = await fetchProduct(id);

    const existsInWishList = await isInWishList(user?.id || "", id);

    const totalCommentPage = await fetchCommentPageByProduct(id);
    const comments: Comment[] = await fetchComments(id, currentPage);

    if (product.length === 0) {
        return <h1>Product Not Found</h1>;
    }

    const { name, price, stock, category, createDate, url } = product[0];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <ProductDetails
            id={id}
            name={name}
            price={price}
            stock={Number(stock)}
            category={category}
            createDate={createDate}
            url={url}
            isLoggedin={isLoggedin}
            user_id={user?.id || ""}
            existsInWL={existsInWishList || false}
        ></ProductDetails>
        <div className="space-y-6">
            <h3 className="text-3xl font-extrabold text-gray-800 border-b-2 border-gray-300 pb-2">Comments</h3>
        <div className="space-y-4 mt-6">
        {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
        ))}
              <div className="flex mt-12 justify-center w-full">
                <Pagination totalPages={totalCommentPage}/>
                </div>
        </div>
        </div>
            <CreateCommentForm product_id={id} user_id={user?.id} />
        </div>
    );
}
