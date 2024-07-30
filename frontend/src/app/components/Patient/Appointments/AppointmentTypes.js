"use client";
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

const AppointmentTypes = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    duration: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
  });
  const { user } = useSelector(state => state.auth);

  async function getAllAppointments(userToken) {
    try {
      setIsLoading(true);
      const apiRes = await axiosInstance.get("appointments/types", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLoadingProgress(progress);
        },
      });
      if (apiRes.data) {
        setAppointments(apiRes.data);
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch appointment types. Please try again later.';
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
      getAllAppointments(user.token);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container">
        <ProgressBar value={loadingProgress} style={{ height: '6px' }}></ProgressBar>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
            <header className="header">
         <h1 style={{ fontSize: 15, paddingTop: 10, paddingBottom: 10 }}>Appointments Types</h1>
       </header>
     

<main className="main">
        <section className="appointments">
          {appointments.length === 0 ? (
            <div className="empty-data-message">No appointments found.</div>
          ) : (
            <div className="table-responsive">
              <DataTable 
                value={appointments} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                responsiveLayout="scroll"
                filters={filters}
                globalFilterFields={['id', 'name', 'duration', 'description']}
                header={<div className="table-header">
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
                </div>}
                className="p-datatable-bootstrap"
              >
                <Column field="id" header="ID" sortable filter filterField="id" filterMatchMode={FilterMatchMode.EQUALS}></Column>
                <Column field="name" header="Name" sortable filter filterField="name" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
                <Column field="duration" header="Duration" sortable filter filterField="duration" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
                <Column field="description" header="Description" sortable filter filterField="description" filterMatchMode={FilterMatchMode.CONTAINS}></Column>
              </DataTable>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AppointmentTypes;

