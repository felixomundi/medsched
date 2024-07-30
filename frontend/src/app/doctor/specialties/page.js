import React from 'react'
import SpecialtiesPage from '@/app/components/Doctor/Specialties/Index'
import DoctorLayout from '@/app/components/Doctor/DoctorLayout'
export const metadata ={
    title:"My specialists"
}
export default function Specialities() {
  return (
    <DoctorLayout allowedRoles={["doctor"]}>
        <SpecialtiesPage></SpecialtiesPage>
    </DoctorLayout>
  )
}
