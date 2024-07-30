import DashboardComponent from "../components/Admin/DashBoardComponent";
import DashboardLayout from "../components/Admin/DashboardLayout"
export const metadata ={
    title :"Admin Dashboard"
}
export default function AdminDashboard() {
    return (
        <DashboardLayout allowedRoles={["admin"]}>
       <DashboardComponent/>
        </DashboardLayout>
       
    );
}