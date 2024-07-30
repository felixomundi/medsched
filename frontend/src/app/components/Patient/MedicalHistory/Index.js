"use client"
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import axiosInstance from '@/app/libs/axios';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
export default function Index() {
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user } = useSelector(state=>state.auth);
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      "visitDate": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      "followUpDate": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      symptoms: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      medications: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      "appointment.AppointmentType.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      "doctor.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });
    useEffect(() => {       
      const fetchMedicalHistory = async () => {
        try {
          setLoading(true)
            const response = await axiosInstance.get('medical-history',{
              headers:{
                Authorization:`Bearer ${user && user.token}`
              }
            });
          
            const formattedData = response.data.map(item => ({
              ...item,
              visitDate: formatDate(item.visitDate),
              followUpDate: item.followUpDate ? formatDate(item.followUpDate) : '-'
          }));
          setMedicalHistory(formattedData);
          setLoading(false);
        } catch (error) {     

        }finally{
          setLoading(false);
        }
    };
    fetchMedicalHistory();
      }, [user]);
   
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

  return (
    <div className="container py-3">     
      <Row>        
        <Col md={12}>
        <h2 style={{fontSize:15, paddingTop:10, paddingBottom:10}}>Medical History</h2>
        </Col>        
      </Row>

      <main className="main">
        <section className="medical-history">          
          <DataTable value={medicalHistory} 
          loading={loading}
           paginator rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
              filters={filters}
              globalFilterFields={['id', 'visitDate', 'followUpDate', "medications", "symptoms",  'doctor.name', "appointment.AppointmentType.name", "appointment.specialty"]}
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
            emptyMessage= "No medical records found"
            >
               <Column field="id" filter sortable header="ID" />
                        <Column field="visitDate" filter sortable header="Visit Date" />
                        <Column field="symptoms" filter sortable header="Symptoms" />
                        <Column field="diagnosis" filter sortable header="Diagnosis" /> 
                        <Column field="medications" filter sortable header="Medications" /> 
                        <Column field="followUpDate" filter sortable header="Follow-Up Date" />
                        <Column field="doctor.name" filter sortable header="Doctor" />
                        <Column field="appointment.specialty" filter sortable header="Specialty" />
                        <Column field="appointment.AppointmentType.name" filter sortable header="Appointment Type" />   
                                          
                    </DataTable>
         
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 MedSched. All rights reserved.</p>
      </footer>
    </div>
  )
}
