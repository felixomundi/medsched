import React from 'react'
import CreateAppointmentComponent from '@/app/components/Admin/Appointments/Create'
import DashboardLayout from '@/app/components/Admin/DashboardLayout'
export const metadata ={
    title:"Add appointment Type"
}
export default function page() {
  return (
    <DashboardLayout allowedRoles={["admin"]}>
        <CreateAppointmentComponent></CreateAppointmentComponent>
    </DashboardLayout>
  )
}
