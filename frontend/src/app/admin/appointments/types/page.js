import PatientAppointmentTypes from "@/app/components/Admin/AppointmentsTypes/Index"
import DashboardLayout from "@/app/components/Admin/DashboardLayout"
export const metadata ={
    title :"Appointment Types"
}
export default function AppointmentType(){
    return( <>
    <DashboardLayout allowedRoles={["admin"]}>
        <PatientAppointmentTypes></PatientAppointmentTypes>
    </DashboardLayout>
    
    </>)
}