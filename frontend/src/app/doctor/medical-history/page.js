import React from 'react'
import MedicalHistory from '@/app/components/Doctor/MedicalHistory/Index'
import DoctorLayout from '@/app/components/Doctor/DoctorLayout'
export const metadata ={
  title: "Patients Medical History"
}
export default function MedicalHistoryPage() {
  return (
   <DoctorLayout allowedRoles={["doctor"]}>
     <MedicalHistory></MedicalHistory>
   </DoctorLayout>
  )
}
