import DashboardLayout from '@/app/components/Admin/DashboardLayout'
import RemindersComponent from '@/app/components/Admin/Reminders'
import React from 'react'

export default function SystemReminders() {
  return (
   <DashboardLayout allowedRoles={["admin"]}>
    <RemindersComponent></RemindersComponent>
   </DashboardLayout>
  )
}
