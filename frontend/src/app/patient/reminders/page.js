import PatientLayout from '@/app/components/Patient/PatientLayout';
import RemindersComponent from '@/app/components/Patient/Reminders';
import React from 'react';
export const metadata ={
    title:"Reminders Page"
}
export default function  Reminder () {   
  return (
  <PatientLayout allowedRoles={["user"]}><RemindersComponent></RemindersComponent></PatientLayout>
  );
};


