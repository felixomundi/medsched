"use client"
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axiosInstance from '@/app/libs/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import '@/styles/AppointmentTypes.css';
import { ProgressBar } from 'primereact/progressbar';
export default function RemindersComponent() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    method: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'Appointment.appointmentDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'Appointment.startTime': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'Appointment.doctor.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
 
  });
  const { user } = useSelector(state => state.auth);
  async function getAllReminders(userToken) {
    try {
      setIsLoading(true);
      const apiRes = await axiosInstance.get("appointments/reminders", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLoadingProgress(progress);
        },
      });    
      if (apiRes.data) {
        const formattedData = apiRes.data.map(item => ({
          ...item,
          Appointment: {
            ...item.Appointment,
            startTime: convertTo12HourFormat(item.Appointment.startTime),
            appointmentDate:formatDate(item.Appointment.appointmentDate),
          },     
          
      }));
        setReminders(formattedData);
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch reminders.';
      if (error.response && error.response.data.message) {
        const { status, data: { message } } = error.response;
        if ([400, 401, 403].includes(status)) {
          errorMessage = message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }

  useEffect(() => {
    if (user && user.token) {
      getAllReminders(user.token);
    }
  }, [user]);

  // Format time function
  const convertTo12HourFormat = (timeString) => {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
    const match = timeString.match(timeRegex);

    if (!match) {
      return null;
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];

    const normalizedDateString = dateString.replace(/\//g, '-');    
    const date = new Date(normalizedDateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  if (isLoading) {
    return (
      <div className="container">
        <ProgressBar value={loadingProgress} style={{ height: '6px' }} />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <header className="header">
        <h1 style={{ fontSize: 15, paddingTop: 10, paddingBottom: 10 }}>Reminders</h1>
      </header>
      <main className="main">
        <section className="reminders">      
            <div className="table-responsive">
              <DataTable
                value={reminders}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                responsiveLayout="scroll"
                filters={filters}
                globalFilterFields={['id', 'status', 'method', 'Appointment.appointmentDate', 'Appointment.startTime', 'Appointment.doctor.name',]}
                header={
                  <div className="table-header">
                    <span className="p-input-icon-left">
                      <i className="pi pi-search" />
                      <input
                        type="search"
                        onInput={(e) => setFilters({
                          ...filters,
                          global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                        })}
                        placeholder="Global Search"
                        className="p-inputtext p-component"
                      />
                    </span>
                  </div>
                }
                className="p-datatable-bootstrap"
              >
                <Column field="id" header="ID" sortable filter filterField="id" filterMatchMode={FilterMatchMode.EQUALS}></Column>
                <Column field="Appointment.appointmentDate" header="Appointment Date" sortable filter filterField="Appointment.appointmentDate" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
                <Column field="Appointment.startTime" header="Start Time" sortable filter filterField="Appointment.startTime" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
                <Column field="Appointment.doctor.name" header="Doctor" sortable filter filterField="Appointment.doctor.name" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
               <Column field="method" header="Method" sortable filter filterField="method" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
                <Column field="status" header="Status" sortable filter filterField="status" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
              </DataTable>
            </div>
        
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>
    </div>
  );
}
