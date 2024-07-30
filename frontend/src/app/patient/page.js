import PatientLayout from "../components/Patient/PatientLayout";
import PatientDashBoardComponent from "../components/Patient/PatientDashBoardComponent";
export const metadata = {
  title: 'Patient Portal - MedSched',
  description: 'Patient portal for managing appointments and viewing medical history',
  keywords: 'healthcare, appointments, medical history, patient portal',
  author: 'MedSched',  
}
export default function Patient() {
  return (    
      <PatientLayout allowedRoles={['user']}>
          <PatientDashBoardComponent/>
 </PatientLayout>
  )
}
