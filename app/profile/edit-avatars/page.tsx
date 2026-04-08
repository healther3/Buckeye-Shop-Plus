import EditUserAvatarForm from "@/app/ui/edit-avatars-form";
import { fetchUserByAuthUser } from "@/app/lib/data";

export default async function EditUserAvatarPage(props: { params: Promise<{ id: string }> }) {
    const user = await fetchUserByAuthUser();

    return (
    <EditUserAvatarForm user={user}/>
    );
}