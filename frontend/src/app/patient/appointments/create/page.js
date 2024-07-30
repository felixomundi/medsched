import PatientCreateAppointment from "@/app/components/Patient/Appointments/Create";
import PatientLayout from "@/app/components/Patient/PatientLayout";
export const metadata = {
    
    title: 'Create Patient Appointments - MedSched',
    description: 'Patient portal for managing appointments and viewing medical history',
    keywords: 'healthcare, appointments, medical history, patient portal',
    author: 'MedSched',  
  }
export default function Create(){
    return <PatientLayout allowedRoles={["user", "patient"]}>
        <PatientCreateAppointment></PatientCreateAppointment>
    </PatientLayout>
}