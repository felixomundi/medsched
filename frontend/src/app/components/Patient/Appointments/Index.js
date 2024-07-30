
"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '@/app/libs/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import AppointmentRescheduleModal from './UpdateModal';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useRouter } from 'next/navigation';
const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
   const router = useRouter();
  const getAllAppointments = async (userToken) => {
    try {
      setIsLoading(true);
      const apiRes = await axiosInstance.get('appointments/auth-user', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setAppointments(apiRes.data.appointments);
    } catch (error) {
      let errorMessage = 'Failed to fetch appointments. Please try again later.';
      if (error.response) {
        if (
          (error.response.status === 401 ||
            error.response.status === 403 ||
            error.response.status === 400) &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        await getAllAppointments(user.token);
      }
    };

    fetchData();
  }, [user]);

  const cancelAppointment = async (appointmentId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(`/appointments/cancel`, { appointmentId: appointmentId}, {
        headers: {
          Authorization: `Bearer ${user && user.token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.data) {
        toast.success(response.data.message);
       getAllAppointments(user && user.token)
      }
    } catch (error) {
      let errorMessage = 'Failed to cancel appointment.';
      if (error.response) {
        if (error.response.status === 401 && error.response.data.message)
          dispatch(logoutAsync())
        if (error.response.status === 403 && error.response.data.message)
          errorMessage = error.response.data.message;
        if (error.response.status === 400 && error.response.data.message)
          errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteMyAppointment = async (userToken, appointmentId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.delete(
        '/appointments/' + appointmentId,
        config
      );
      if (response.data) {
        toast.success(response.data.message);
        getAllAppointments(userToken);
      }
    } catch (error) {
      let errorMessage = 'Failed to delete appointment. Please try again later.';
      if (error.response) {
        if (
          (error.response.status === 401 ||
            error.response.status === 403 ||
            error.response.status === 400) &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, appointment) => {
    // if (action === 'delete') {
    //   if (user && user.token) {
    //     await deleteMyAppointment(user.token, appointment.id);
    //   }
    // } 
    if(action === "cancel"){
      await cancelAppointment(appointment.id);
    }
    else if (action === 'reschedule') {
      setSelectedAppointment(appointment);
      setIsModalVisible(true);
    }
  };

  const actionTemplate = (rowData) => {
    const actions = [
      // { label: 'Delete', value: 'delete' },
      { label: 'Cancel', value: 'cancel' },
      { label: 'Reschedule', value: 'reschedule' }
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No Date';
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

  const appointmentTypeTemplate = (rowData) => {
    return <>{rowData.AppointmentType.name}</>;
  };

  const dateTemplate = (rowData) => {
    return <>{formatDate(rowData.appointmentDate)}</>;
  };

  const timeTemplate = (rowData) => {
    return (
      <>
        {convertTo12HourFormat(rowData.startTime)}-
        {convertTo12HourFormat(rowData.endTime)}
      </>
    );
  };

  const providerTemplate = (rowData) => {
    return <>{rowData.doctor.name}</>;
  };

  const statusTemplate = (rowData) => {
    return <>{rowData.status}</>;
  };

  const header = (
    <div className="table-header">
      <h2>Your Appointments</h2>
      <div className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
      </div>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1 style={{ fontSize: 15, paddingTop: 10, paddingBottom: 10 }}>Appointments Page</h1>
        <nav>
          <h3 className='py-3'>
            <Link href="/patient/appointments/create" className='btn btn-primary'>Book Appointment</Link>
          </h3>
        </nav>
      </header>

      <main className="main">
        <section className="appointments">
          <div className="card">
            <DataTable value={appointments} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments" globalFilter={globalFilter} header={header}>
              <Column field="id" header="ID" sortable />
              <Column field="AppointmentType.name" header="Appointment Type" body={appointmentTypeTemplate} sortable />
              <Column field="appointmentDate" header="Date" body={dateTemplate} sortable />
              <Column field="startTime" header="Time" body={timeTemplate} sortable />
              <Column field="doctor.name" header="Provider" body={providerTemplate} sortable />
              <Column field="status" header="Status" body={statusTemplate} sortable />
              <Column field="actions" header="Action" body={actionTemplate} />
            </DataTable>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>

      {isModalVisible && selectedAppointment && (
        <AppointmentRescheduleModal 
          appointment={selectedAppointment} 
          // onHide={() => setIsModalVisible(false)} 
          getAllAppointments={() => getAllAppointments(user.token)} 
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default PatientAppointments;
