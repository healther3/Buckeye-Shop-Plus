import { getUser, auth } from "@/auth";
import { fetchWishList } from "../lib/data";

export default async function WishList(){
    const session = await auth();
    const user = session?.user;
    return(
        <div>wishlist</div>
    );
}