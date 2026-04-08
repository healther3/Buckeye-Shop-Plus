import EditUserAvatarForm from "@/app/ui/edit-avatars-form";
import { fetchUserByAuthUser } from "@/app/lib/data";
import  UserAddressForm from "@/app/ui/create-user-address-form"

export default async function EditUserAddressPage(props: { params: Promise<{ id: string }> }) {
    const user = await fetchUserByAuthUser();

    return (
        <UserAddressForm user_id = {user.id}/>
    );
}