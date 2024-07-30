import PatientLayout from "@/app/components/Patient/PatientLayout";
import MedicalRecords from "@/app/components/Patient/MedicalHistory/Index";

export const metadata ={
  title:"Medical Records"
}
export default function MedicalHistory (){
  return (
  <PatientLayout allowedRoles={["user"]}>
<MedicalRecords></MedicalRecords>
  </PatientLayout>
  )
}

