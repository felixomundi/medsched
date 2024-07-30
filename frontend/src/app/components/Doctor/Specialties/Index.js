// "use client"
// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
// import axiosInstance from "@/app/libs/axios";  // Your axios instance
// import 'primereact/resources/themes/saga-blue/theme.css';  // Your preferred theme
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutAsync } from '@/redux/features/auth';
// import { toast } from 'react-toastify';

// const SpecialtiesPage = () => {
//   const [specialties, setSpecialties] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [selectedSpecialty, setSelectedSpecialty] = useState(null);
//   const { user } = useSelector(state => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//   if(user && user.token){
//     fetchSpecialties(user.token);
//   }
//   }, [user]);

//   const fetchSpecialties = async (token) => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       };
//       const response = await axiosInstance.get('/appointments/doctors/specialties', config);
//       setSpecialties(response.data);
//     } catch (error) {
//       if (error.response.status === 401 || error.response.status === 403) {
//         dispatch(logoutAsync());
//       } else {
//         toast.error("Failed to get your specialties");
//       }
//     }
//   };

//   const onGlobalFilterChange = (e) => {
//     setGlobalFilter(e.target.value || '');
//   };

//   const specialtyFilterTemplate = (options) => {
//     return (
//       <Dropdown
//         value={options.value || ''}
//         options={specialties.map(specialty => ({ label: specialty.specialty, value: specialty.id }))}
//         onChange={(e) => options.filterApplyCallback(e.value)}
//         placeholder="Select Specialty"
//         className="p-column-filter"
//         showClear
//       />
//     );
//   };

//   const header = (
//     <div className="table-header py-2">
//       <h5 className="p-m-0 py-3">Manage Specialties</h5>
//       <span className="p-input-icon-left">
//         <i className="pi pi-search" />
//         <InputText type="search" value={globalFilter} onChange={onGlobalFilterChange} placeholder="Search..." />
//       </span>
//     </div>
//   );

//   return (
//     <div className="datatable-crud-demo">
//       <div className="card">
//         <DataTable
//           value={specialties}
//           paginator
//           rows={10}
//           header={header}
//           globalFilter={globalFilter}
//           emptyMessage="No specialties found."
//           selection={selectedSpecialty}
//           onSelectionChange={e => setSelectedSpecialty(e.value)}
//           dataKey="id"
//         >
//           <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" />
                   
//           <Column
//             field="specialty"
//             header="Specialty"
//             sortable
//             filter
//             filterElement={specialtyFilterTemplate}
//           />         
//         </DataTable>
//       </div>
//     </div>
//   );
// };

// export default SpecialtiesPage;


"use client";
// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import axiosInstance from "@/app/libs/axios";  // Your axios instance
// import 'primereact/resources/themes/saga-blue/theme.css';  // Your preferred theme
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutAsync } from '@/redux/features/auth';
// import { toast } from 'react-toastify';

// const SpecialtiesPage = () => {
//   const [specialties, setSpecialties] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [selectedSpecialty, setSelectedSpecialty] = useState(null);
//   const { user } = useSelector(state => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (user && user.token) {
//       fetchSpecialties(user.token);
//     }
//   }, [user]);

//   const fetchSpecialties = async (token) => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       };
//       const response = await axiosInstance.get('/appointments/doctors/specialties', config);
//       setSpecialties(response.data);
//     } catch (error) {
//       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//         dispatch(logoutAsync());
//       } else {
//         toast.error("Failed to get your specialties");
//       }
//     }
//   };

//   const onGlobalFilterChange = (e) => {
//     setGlobalFilter(e.target.value || '');
//   };

//   const specialtyFilterTemplate = (options) => {
//     return (
//       <Dropdown
//         value={options.value || ''}
//         options={specialties.map(specialty => ({ label: specialty.specialty, value: specialty.id }))}
//         onChange={(e) => options.filterApplyCallback(e.value)}
//         placeholder="Select Specialty"
//         className="p-column-filter"
//         showClear
//       />
//     );
//   };

//   const header = (
//     <div className="table-header py-2">
//       <h5 className="p-m-0 py-3">Manage Specialties</h5>
//       <span className="p-input-icon-left">
//         <i className="pi pi-search" />
//         <InputText type="search" value={globalFilter} onChange={onGlobalFilterChange} placeholder="Search..." />
//       </span>
//     </div>
//   );

//   return (
//     <div className="datatable-crud-demo">
//       <div className="card">
//         <DataTable
//           value={specialties}
//           paginator
//           rows={10}
//           header={header}
//           globalFilter={globalFilter}
//           emptyMessage="No specialties found."
//           selection={selectedSpecialty}
//           onSelectionChange={e => setSelectedSpecialty(e.value)}
//           dataKey="id"
//         >
//           <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" />
                   
//           <Column
//             field="specialty"
//             header="Specialty"
//             sortable
//             filter
//             filterMatchMode="contains" 
//             filterElement={specialtyFilterTemplate}
//           />         
//         </DataTable>
//       </div>
//     </div>
//   );
// };

// export default SpecialtiesPage;


"use client"

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axiosInstance from "@/app/libs/axios";  // Your axios instance
import { FilterMatchMode } from 'primereact/api';  // Import FilterMatchMode
import 'primereact/resources/themes/saga-blue/theme.css';  // Your preferred theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '@/redux/features/auth';
import { toast } from 'react-toastify';

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.token) {
      fetchSpecialties(user.token);
    }
  }, [user]);

  const fetchSpecialties = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axiosInstance.get('/appointments/doctors/specialties', config);
      setSpecialties(response.data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        dispatch(logoutAsync());
      } else {
        toast.error("Failed to get your specialties");
      }
    }
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value || '');
  };

  const specialtyFilterTemplate = (options) => {
    return (
      <InputText
        type="text"
        value={options.value ? options.value.label : ''}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search Specialty"
        className="p-column-filter"
      />
    );
  };

  const header = (
    <div className="table-header py-2">
      <h5 className="p-m-0 py-3">Manage Specialties</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" value={globalFilter} onChange={onGlobalFilterChange} placeholder="Search..." />
      </span>
    </div>
  );

  return (
    <div className="datatable-crud-demo">
      <div className="card">
        <DataTable
          value={specialties}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No specialties found."
          selection={selectedSpecialty}
          onSelectionChange={e => setSelectedSpecialty(e.value)}
          dataKey="id"
        >
          <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" />
                   
          <Column
            field="specialty"
            header="Specialty"
            sortable
            filter
            filterMatchMode={FilterMatchMode.CONTAINS} 
            filterElement={specialtyFilterTemplate}
          />         
        </DataTable>
      </div>
    </div>
  );
};

export default SpecialtiesPage;
