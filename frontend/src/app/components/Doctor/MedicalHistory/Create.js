"use client"
import Link from 'next/link';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/app/libs/axios';
import { logoutAsync } from '@/redux/features/auth';
import { toast } from 'react-toastify';

export default function Create() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.auth); 
  const validationSchema = Yup.object().shape({
    appointmentDate: Yup.date().required('Appointment Date is required'),
    patient: Yup.string().required('Patient is required'),
    appointmentId: Yup.string().required('Appointment is required'),
    visitDate: Yup.date().required('Visit Date is required'),
    symptoms: Yup.string().required('Symptoms are required'),
    diagnosis: Yup.string().required('Diagnosis is required'),
    medications: Yup.string().required('Medications are required'),
  });

  const formik = useFormik({
    initialValues: {
      appointmentDate:'',
      patient: '',      
      visitDate: '',
      symptoms: '',
      diagnosis: '',
      medications: '',
      notes: '',
      followUpDate: '',    
      height: '',
      weight: '',
      bloodPressure: '',
      heartRate: '',
      allergies: '',
      pastSurgeries: '',
      familyHistory: '',
      socialHistory: '',
      diet: '',
      exercise: '',
      smoking: '',
      alcohol: '',
      appointmentType: '',
      specialty: '',
      appointmentId:'',
    },
    validationSchema: validationSchema,
    onSubmit: async(values, {setSubmitting, resetForm}) => {
        try {
            const config ={
                headers:{
                    Authorization:`Bearer ${user && user.token}`
                }
            }   
                
            const response = await axiosInstance.post('medical-history', values, config);
            if(response.data.message){
              toast.success(response.data.message);            
            }

            
        } catch (error) {
           if(error.response && error.response.status === 401){
            dispatch(logoutAsync())
           }
           else if(error.response && error.response.status === 400 && error.response.data.message){
            toast.error(error.response.data.message)
           }
           else{
            toast.error("Error in creating medical record")
           }            
        }
        finally{
          resetForm();
          setSubmitting(false);
        }
     
    },
    validateOnChange: false,
    validateOnBlur: false
  });


  // get patients
  const handleAppointmentDateChange = async (event) => {
    const selectedDate = event.target.value;  
    formik.setFieldValue('appointmentDate', selectedDate);
    try {
      const config = {
        headers:
        {
          Authorization: `Bearer ${user && user.token}`
        }
      }
      const response = await axiosInstance.get(`appointments/patients?appointmentDate=${selectedDate}`, config);
      if(response.data){
        setPatients(response.data || []); 
      }     
    } catch (error) {
      if(error.response){
        if(error.response.status === 401){
          dispatch(logoutAsync())
        }

      }
    }
  };


  const getPatientAppointmentsByDate = async (event) => {
    try {
      const selectedDate = formik.values.appointmentDate; 
      const patientId = event.target.value;
      formik.setFieldValue('patient', patientId);
      if (!patientId) {       
        return; 
      } 
      const response = await axiosInstance.get('appointments/by-date', {
        headers: {
          Authorization: `Bearer ${user && user.token}`, 
        },
        params: {
          patientId: patientId,
          appointmentDate: selectedDate,
        },
      });  
      setAppointments(response.data || []);
      return response.data;
    } catch (error) {
      if(error.response){
        if(error.response.status === 401){
          dispatch(logoutAsync())
        }
      }
     
    }
  };

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card mt-3">
            <div className="card-body py-3">
              <h2 className="card-title">Add Medical History</h2>
              <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className="row">
                <div className="form-group col-md-6">
                    <label htmlFor="appointmentDate">Appointment Date</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      className={`form-control ${
                        formik.touched.appointmentDate && formik.errors.appointmentDate ? 'is-invalid' : ''
                      }`}
                      onChange={(e)=>{
                        formik.handleChange(e)
                        handleAppointmentDateChange(e)
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.appointmentDate}
                    />
                    {formik.touched.appointmentDate && formik.errors.appointmentDate ? (
                      <div className="invalid-feedback">{formik.errors.appointmentDate}</div>
                    ) : null}
                  </div>
                    
  <div className="form-group col-md-6">
  <label htmlFor="patient">Patient</label>
  <select
    id="patient"
    name="patient"
    className={`form-control ${
      formik.touched.patient && formik.errors.patient ? 'is-invalid' : ''
    }`}
    onChange={(e) => {
      formik.handleChange(e); 
      getPatientAppointmentsByDate(e); 
    }}
    onBlur={formik.handleBlur}
    value={formik.values.patient}
  >
    <option value="">Select patient</option>
    {patients.map((patient) => (
      <option key={patient.id} value={patient.id}>
        {patient.name}
      </option>
    ))}
  </select>
  {formik.touched.patient && formik.errors.patient ? (
    <div className="invalid-feedback">{formik.errors.patient}</div>
  ) : null}
</div>

<div className="form-group col-md-6">
  <label htmlFor="appointmentId">Select Appointment</label>
  <select
    id="appointmentId"
    name="appointmentId"
    className={`form-control ${
      formik.touched.appointmentId && formik.errors.appointmentId ? 'is-invalid' : ''
    }`}
    onChange={(e) => {
      formik.handleChange(e); 
     
    }}
    onBlur={formik.handleBlur}
    value={formik.values.appointmentId}
  >
    <option value="">Select Appointment</option>
    {appointments.map((appointment) => (
      <option key={appointment.id} value={appointment.id}>   
        {`${appointment.AppointmentType.name} ${appointment.specialty} ${convertTo12HourFormat(appointment.startTime)} to ${convertTo12HourFormat(appointment.endTime)}`}             
      
      </option>
    ))}
  </select>
  {formik.touched.appointmentId && formik.errors.appointmentId ? (
    <div className="invalid-feedback">{formik.errors.appointmentId}</div>
  ) : null}
</div>

                  <div className="form-group col-md-6">
                    <label htmlFor="visitDate">Visit Date</label>
                    <input
                      type="date"
                      id="visitDate"
                      name="visitDate"
                      className={`form-control ${
                        formik.touched.visitDate && formik.errors.visitDate ? 'is-invalid' : ''
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.visitDate}
                    />
                    {formik.touched.visitDate && formik.errors.visitDate ? (
                      <div className="invalid-feedback">{formik.errors.visitDate}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="symptoms">Symptoms</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    className={`form-control ${
                      formik.touched.symptoms && formik.errors.symptoms ? 'is-invalid' : ''
                    }`}
                    rows="3"
                    placeholder="Enter symptoms"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.symptoms}
                  />
                  {formik.touched.symptoms && formik.errors.symptoms ? (
                    <div className="invalid-feedback">{formik.errors.symptoms}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="diagnosis">Diagnosis</label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    className={`form-control ${
                      formik.touched.diagnosis && formik.errors.diagnosis ? 'is-invalid' : ''
                    }`}
                    rows="3"
                    placeholder="Enter diagnosis"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.diagnosis}
                  />
                  {formik.touched.diagnosis && formik.errors.diagnosis ? (
                    <div className="invalid-feedback">{formik.errors.diagnosis}</div>
                  ) : null}
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="medications">Medications</label>
                    <textarea
                      id="medications"
                      name="medications"
                      className={`form-control ${
                        formik.touched.medications && formik.errors.medications ? 'is-invalid' : ''
                      }`}
                      rows="3"
                      placeholder="Enter medications prescribed"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.medications}
                    />
                    {formik.touched.medications && formik.errors.medications ? (
                      <div className="invalid-feedback">{formik.errors.medications}</div>
                    ) : null}
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="form-control"
                      rows="3"
                      placeholder="Additional notes"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.notes}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="followUpDate">Follow-Up Date</label>
                    <input
                      type="date"
                      id="followUpDate"
                      name="followUpDate"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.followUpDate}
                    />
                  </div>
                
                </div>
                

                {/* Additional Fields */}
                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.height}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.weight}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="bloodPressure">Blood Pressure</label>
                    <input
                      type="text"
                      id="bloodPressure"
                      name="bloodPressure"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.bloodPressure}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="heartRate">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      id="heartRate"
                      name="heartRate"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.heartRate}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="allergies">Allergies</label>
                    <input
                      type="text"
                      id="allergies"
                      name="allergies"
                      className="form-control"
                      placeholder="Any known allergies"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.allergies}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="pastSurgeries">Past Surgeries</label>
                    <input
                      type="text"
                      id="pastSurgeries"
                      name="pastSurgeries"
                      className="form-control"
                      placeholder="Any past surgeries"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pastSurgeries}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="familyHistory">Family History</label>
                    <textarea
                      id="familyHistory"
                      name="familyHistory"
                      className="form-control"
                      rows="3"
                      placeholder="Family medical history"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.familyHistory}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="socialHistory">Social History</label>
                    <textarea
                      id="socialHistory"
                      name="socialHistory"
                      className="form-control"
                      rows="3"
                      placeholder="Social habits and history"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.socialHistory}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="diet">Dietary Preferences</label>
                    <input
                      type="text"
                      id="diet"
                      name="diet"
                      className="form-control"
                      placeholder="Patient's dietary preferences or restrictions"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.diet}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="exercise">Exercise Routine</label>
                    <input
                      type="text"
                      id="exercise"
                      name="exercise"
                      className="form-control"
                      placeholder="Patient's exercise routine or habits"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.exercise}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="smoking">Smoking Habits</label>
                    <input
                      type="text"
                      id="smoking"
                      name="smoking"
                      className="form-control"
                      placeholder="Patient's smoking habits (if applicable)"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.smoking}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="alcohol">Alcohol Consumption</label>
                    <input
                      type="text"
                      id="alcohol"
                      name="alcohol"
                      className="form-control"
                      placeholder="Patient's alcohol consumption (if applicable)"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.alcohol}
                    />
                  </div>
                </div>

                <div className="card-footer py-3">
                  <Link href="/doctor/medical-history" passHref>
                    <button type="button" className="btn btn-secondary float-start">Back</button>
                  </Link>
                  <button type="submit" className="btn btn-primary float-end" disabled={formik.isSubmitting}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


