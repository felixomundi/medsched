import UsersComponent from '@/app/components/Admin/Users/Users'
import DashboardLayout from '@/app/components/Admin/DashboardLayout'
import React from 'react'
export const metadata = {
  title:'System Users'  
}

export default function Users() {
  return ( 
    <DashboardLayout allowedRoles={["admin"]}>
      <UsersComponent />
    </DashboardLayout>
    
  )
}