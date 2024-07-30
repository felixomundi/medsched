import AppointmentTypes from '@/app/components/Doctor/Appointments/Types'
import DoctorLayout from '@/app/components/Doctor/DoctorLayout'
import React from 'react'
export const metadata ={
    title:"Appointment Types Page"
}
export default function AppointmentTypesPage() {
  return (
   <DoctorLayout allowedRoles={["doctor"]}>
<AppointmentTypes></AppointmentTypes>
   </DoctorLayout>
  )
}
