import DoctorLayout from "@/app/components/Doctor/DoctorLayout";
import DoctorAppointments from "@/app/components/Doctor/Appointments/Index";

export const metadata = {

  title: 'Doctor Appointments - MedSched',
  description: 'Patient portal for managing appointments and viewing medical history',
  keywords: 'healthcare, appointments, medical history, patient portal',
  author: 'MedSched',  
}
export default function AppointmentsPage() {
  return (    
 <DoctorLayout allowedRoles={["doctor"]}>
   <DoctorAppointments></DoctorAppointments>
 </DoctorLayout>
  )
}
