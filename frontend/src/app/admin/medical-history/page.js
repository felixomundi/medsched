import DashboardLayout from '@/app/components/Admin/DashboardLayout'
import Index from '@/app/components/Admin/MedicalHistory/Index'
import React from 'react'
export const metadata = {
    title:"Medical History"
}
export default function MedicalHistoryPage() {
  return (
    <DashboardLayout allowedRoles={["admin"]}>
        <Index></Index>
    </DashboardLayout>
  )
}
