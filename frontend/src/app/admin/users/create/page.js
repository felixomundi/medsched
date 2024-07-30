import DashboardLayout from "@/app/components/Admin/DashboardLayout";
import CreateUsersComponent from "../../../components/Admin/Users/Create"
export const metadata = {
  title:'Create User Page'
}
export default function CreateUsersPage() {
  return <DashboardLayout allowedRoles={["admin"]}>
    <CreateUsersComponent/>
  </DashboardLayout>;
}