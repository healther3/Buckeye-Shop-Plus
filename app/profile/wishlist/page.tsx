import { fetchProduct, fetchWishList } from "@/app/lib/data";
import { auth } from "@/auth";
import Card from './card'

export default async function WishList() {
    const session = await auth();
    const user = session?.user;
    const list = (await fetchWishList(user?.id || "")) ?? [];

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((item) => (
                <Card item={item} key={item.id}></Card>
            ))}
        </div>
    );
}
