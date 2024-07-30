import DashboardLayout from "@/app/components/Admin/DashboardLayout"
import Index from "@/app/components/Admin/Appointments/Index"
export const metadata ={
    title:"System Appointments"
}
export default function Appointments(){
    return(
    <DashboardLayout allowedRoles={["admin"]}>
    <Index></Index>
    </DashboardLayout>)
}