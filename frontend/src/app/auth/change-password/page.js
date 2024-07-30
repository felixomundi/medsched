import ChangePasswordComponent from "@/app/components/Auth/ChangePasswordComponent"
import AuthLayout from "@/app/components/Layouts/Commons/AuthLayout";
export const metadata = {
title:'Change Password'
}
export default function ChangePasswordPage() {
    return(
       <AuthLayout>  <ChangePasswordComponent /></AuthLayout>)
    

}