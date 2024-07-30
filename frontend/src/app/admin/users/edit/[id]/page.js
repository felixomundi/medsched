import EditUserComponent from "@/app/components/Admin/Users/Edit";
import DashboardLayout from "@/app/components/Admin/DashboardLayout";

export default function EditUser() {
    return <DashboardLayout allowedRoles={["admin"]}>
        <EditUserComponent/>
    </DashboardLayout>
}