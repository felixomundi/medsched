import AdminCreateAppointment from "@/app/components/Doctor/Appointments/Create";
import DoctorLayout from "@/app/components/Doctor/DoctorLayout";
export const metadata = {    
    title: 'Create Patient Appointments - MedSched',
    description: 'Patient portal for managing appointments and viewing medical history',
    keywords: 'healthcare, appointments, medical history, patient portal',
    author: 'MedSched',  
  }
export default function Create(){
    return <DoctorLayout allowedRoles={["doctor"]}>
        <AdminCreateAppointment></AdminCreateAppointment>
    </DoctorLayout>
}