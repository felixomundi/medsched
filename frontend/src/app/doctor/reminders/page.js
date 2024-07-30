import React from 'react'
import DoctorLayout from '@/app/components/Doctor/DoctorLayout'
import Reminders from '@/app/components/Doctor/Reminders';
export const metadata = {
  title: "Reminders"
}
function DoctorReminderPage() {
  return (
   <DoctorLayout allowedRoles={["doctor"]}>
<Reminders></Reminders>
   </DoctorLayout>
  )
}

export default DoctorReminderPage;