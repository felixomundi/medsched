import CreateAppointmentTypeComponent from "@/app/components/Admin/AppointmentsTypes/Create"
import DashboardLayout from "@/app/components/Admin/DashboardLayout"
export const metadata = {
    title:"Create Appointment Type"
}
export default function CreateAppointmentType(){
    return( <>
    <DashboardLayout allowedRoles={["admin"]}>
        <CreateAppointmentTypeComponent></CreateAppointmentTypeComponent>
    </DashboardLayout>
    
    </>)
}