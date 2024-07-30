import PatientLayout from "@/app/components/Patient/PatientLayout";
import PatientAppointments from "@/app/components/Patient/Appointments/Index";
export const metadata = {

  title: 'Patient Appointments - MedSched',
  description: 'Patient portal for managing appointments and viewing medical history',
  keywords: 'healthcare, appointments, medical history, patient portal',
  author: 'MedSched',  
}
export default function Patient() {
  return (    
 <PatientLayout allowedRoles={["user", "patient"]}>
   <PatientAppointments></PatientAppointments>
 </PatientLayout>
  )
}
