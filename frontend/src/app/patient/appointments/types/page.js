import AppointmentTypes from '@/app/components/Patient/Appointments/AppointmentTypes'
import PatientLayout from '@/app/components/Patient/PatientLayout'
import React from 'react'
export const metadata ={
    title:"Appointment Types Page"
}
export default function AppointmentTypesPage() {
  return (
   <PatientLayout allowedRoles={["patient"]}>
<AppointmentTypes></AppointmentTypes>
   </PatientLayout>
  )
}
