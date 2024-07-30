import ProfileComponent from "@/app/components/Auth/ProfileComponent";
import AuthLayout from "@/app/components/Layouts/Commons/AuthLayout";
export const metadata = {
    title:'Profile Page'
}
export default function Profile() {
    return (
        <AuthLayout><ProfileComponent/></AuthLayout>
    )
}