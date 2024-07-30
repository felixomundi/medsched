import React from 'react'
import Create from '@/app/components/Admin/MedicalHistory/Create'
import DashboardLayout from '@/app/components/Admin/DashboardLayout'
export const metadata ={
    title:"Create Patient Medical Record"
}
export default function page() {
  return (
    <DashboardLayout allowedRoles={["admin"]}>
        <Create></Create>
    </DashboardLayout>
  )
}
