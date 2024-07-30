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
import Link from 'next/link';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Dropdown } from 'primereact/dropdown';
import UpdateModal from './UpdateModal';


const AppointmentTypes = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'duration': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  });
  const { user } = useSelector(state => state.auth);

  async function getAllAppointments(userToken) {
    try {
      setIsLoading(true);
      const apiRes = await axiosInstance.get("appointments/types", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (apiRes.data) {
        setAppointments(apiRes.data);
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch appointment types';
      if (error.response && error.response.data.message) {
        const { status, data: { message } } = error.response;
        if ([400, 401, 403].includes(status)) {
          errorMessage = message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }



  async function handleDelete(id) {
    try {
   const response =   await axiosInstance.delete(`appointments/types/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if(response.data){
        getAllAppointments(user?.token);
        toast.success(response.data.message);
      }
    } catch (error) {
      let errorMessage = 'Failed to delete appointment type';
      if (error.response && error.response.data.message) {
        const { status, data: { message } } = error.response;
        if ([400, 401, 403].includes(status)) {
          errorMessage = message;
        }
      }
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    if (user && user.token) {
      getAllAppointments(user.token);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }  

  const handleAction = async (action, appointment) => {
    if (action === 'delete') {
      if (user && user.token) {
        await handleDelete(appointment.id);
      }
    }   
    else if(action === 'edit') {   
      setSelectedAppointment(appointment);
      setIsModalVisible(true);
    }
  };

  const actionTemplate = (rowData) => {
    const actions = [    
      { label: 'Delete', value: 'delete' },   
      { label: 'Edit', value: 'edit' }
    ];

    return (
      <Dropdown 
        value={null} 
        options={actions} 
        onChange={(e) => handleAction(e.value, rowData)} 
        placeholder="Select Action" 
      />
    );
  };


  return (
    <div className="container">
      <header className="header">
        <h1 style={{ fontSize: 15, paddingTop: 10, paddingBottom: 10 }}>Appointments Types</h1>
      </header>
<div className="row">
  <div className="col-md-6 py-3">
    <Link className="btn btn-primary" href="/admin/appointments/types/create">Create</Link>
  </div>
</div>
      <main className="main">
        <section className="appointments">        
          <div className="table-responsive">
            <DataTable 
              value={appointments} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25]} 
              responsiveLayout="scroll"
              filters={filters}
              globalFilterFields={['id', 'name', 'duration']}
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
              emptyMessage="No appointment types found."
            >
              <Column field="id" header="ID" sortable />
              <Column field="name" header="Name" filter sortable />
              <Column field="duration" header="Duration" filter sortable />             
              <Column body={actionTemplate} header="Actions" />
            </DataTable>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>

      {isModalVisible && selectedAppointment && (
        <UpdateModal 
          appointment={selectedAppointment}        
          getAllAppointments={() => getAllAppointments(user && user.token)} 
          onClose={() => setIsModalVisible(false)}
        />
      )}


    </div>
  );
};

export default AppointmentTypes;
