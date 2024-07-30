import React from 'react'
import Create from '@/app/components/Doctor/MedicalHistory/Create'
import DoctorLayout from '@/app/components/Doctor/DoctorLayout'
export const metadata ={
    title:"Create Patient Medical Record"
}
export default function page() {
  return (
    <DoctorLayout allowedRoles={["doctor"]}>
        <Create></Create>
    </DoctorLayout>
  )
}
