"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '@/app/libs/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { logoutAsync } from '@/redux/features/auth';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [globalFilter, setGlobalFilter] = useState(null);
  const router = useRouter();
const dispatch = useDispatch();

  const getAllUsers = async (userToken) => {
    try {
      setIsLoading(true);
      const apiRes = await axiosInstance.get('users', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setUsers(apiRes.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch users.';
      if (error.response) {
        if (error.response.status === 401){
          dispatch(logoutAsync())
          }else if( error.response.status === 403 || error.response.status === 400){
            errorMessage = error.response.data.message      
      }
     
    }
  }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {   
      if (user && user.token) {
     getAllUsers(user.token);     
    };
   
  }, [user]);

  const deleteUser = async (userToken, userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      setIsLoading(true);
      const response = await axiosInstance.delete(
        'users/' + userId,
        config
      );
      if (response.data) {
        toast.success(response.data.message);
        getAllUsers(userToken);
      }
    } catch (error) {
     let errorMessage = 'Failed to delete user.';
      if (error.response) {
        if (error.response.status === 401){
            dispatch(logoutAsync())
          }  else if( error.response.status === 403 &&
            error.response.data.message ||
            error.response.status === 400 &&
          error.response.data.message
        ) {
         errorMessage = error.response.data.message;
        }
      }
     toast.error(errorMessage);
     return;
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleAction = async (action, rowData) => {
    if (action === 'delete') {    
      confirmAlert({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this user?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              if (user && user.token) {
                await deleteUser(user.token, rowData.id);
              }
            }
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
    } 
    if(action === "edit"){
      router.push(`/admin/users/edit/${rowData.id}`);
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

  
  const dateTemplate = (rowData) => {
    return <>{formatDate(rowData.createdAt)}</>;
  }

  const roleMapping = {
    'user': 'Patient',
    'doctor': 'Doctor',
    'admin': 'Admin',
  };

  const roleTemplate = (rowData) => {
    return <>{roleMapping[rowData.role] || 'Unknown Role'}</>;
  };

  const header = (
    <div className="table-header">
      <h2>Manage Users</h2>
      <div className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
      </div>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1 style={{ fontSize: 15, paddingTop: 10, paddingBottom: 10 }}>Users Page</h1>
        <nav>
          <h3 className='py-3'>
            <Link href="/admin/users/create" className='btn btn-primary'>Create User</Link>
          </h3>
        </nav>
      </header>

      <main className="main">
        <section className="appointments">
          <div className="card">
            <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" globalFilter={globalFilter} header={header}>
              <Column field="id" header="ID" sortable />
              <Column field="name" header="Name"  sortable />
              <Column field="email" header="Email"  sortable />
              <Column field="role" header="Role"  body={roleTemplate} sortable />
              <Column field="createdAt" header="Created Date" body={dateTemplate} sortable />
              <Column field="actions" header="Action" body={actionTemplate} />
            </DataTable>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>

     
    
    </div>
  );
};

export default UsersComponent;
