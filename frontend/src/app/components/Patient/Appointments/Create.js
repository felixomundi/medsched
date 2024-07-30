"use client"
import { useFormik } from 'formik';
import axiosInstance from "@/app/libs/axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from 'next/link';
import Select from 'react-select';
export default function PatientCreateAppointment() {
  const [appointment_types, setAppointmentTypes] = useState([]); 
  const [providers, setProviders] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const [selectedSpecialty, setSelectedSpecialty] = useState({});    
    const doctorSpecialties = [
      { value: "", label: "Select Specialty" },
        { value: "Allergy and Immunology", label: "Allergy and Immunology" },
        { value: "Anesthesiology", label: "Anesthesiology" },
        { value: "Cardiology", label: "Cardiology" },
        { value: "Dermatology", label: "Dermatology" },
        { value: "Emergency Medicine", label: "Emergency Medicine" },
        { value: "Endocrinology", label: "Endocrinology" },
        { value: "Family Medicine", label: "Family Medicine" },
        { value: "Gastroenterology", label: "Gastroenterology" },
        { value: "Geriatrics", label: "Geriatrics" },
        { value: "Hematology", label: "Hematology" },
        { value: "Infectious Disease", label: "Infectious Disease" },
        { value: "Internal Medicine", label: "Internal Medicine" },
        { value: "Nephrology", label: "Nephrology" },
        { value: "Neurology", label: "Neurology" },
        { value: "Obstetrics and Gynecology (OB/GYN)", label: "Obstetrics and Gynecology (OB/GYN)" },
        { value: "Oncology", label: "Oncology" },
        { value: "Ophthalmology", label: "Ophthalmology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Otolaryngology (ENT)", label: "Otolaryngology (ENT)" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Physical Medicine and Rehabilitation (PM&R)", label: "Physical Medicine and Rehabilitation (PM&R)" },
        { value: "Psychiatry", label: "Psychiatry" },
        { value: "Pulmonology", label: "Pulmonology" },
        { value: "Radiology", label: "Radiology" },
        { value: "Rheumatology", label: "Rheumatology" },
        { value: "Surgery", label: "Surgery" },
        { value: "Urology", label: "Urology" }
      ];
      const handleSpecialtyChange = (selectedOptions) => {
        setSelectedSpecialty(selectedOptions);
        formik.setFieldValue('specialty', selectedOptions?.value || ''); // Set specialty field value
        formik.handleBlur('specialty'); 
        if (selectedOptions.value) {       
          fetchProviders(selectedOptions.value);
        }
      };
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };
  const [minDateTime, setMinDateTime] = useState('');

  const formik = useFormik({
    initialValues: {
      specialty: '',
      provider: '',
      appointmentType: '',
      appointmentDate: '',
      appointmentTime: '',
    },
    validate: values => {
      const errors = {};
      if (!values.specialty) {
        errors.specialty = 'Required'; // Validate if speciality is empty
      }
      if (!values.provider) {
        errors.provider = 'Required';
      }
      if (!values.appointmentType) {
        errors.appointmentType = 'Required';
      }
      if (!values.appointmentDate) {
        errors.appointmentDate = 'Required';
      }
      if (!values.appointmentTime) {
        errors.appointmentTime = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const selectedSlot = availableTimeSlots.find(slot => slot.display === values.appointmentTime);
        const data = {
          doctorId: values.provider,
          appointmenttypeId: values.appointmentType,
          appointmentDate: values.appointmentDate,
          startTime: selectedSlot ? selectedSlot.start : '',
          endTime: selectedSlot ? selectedSlot.end : '',
          specialty:values.specialty,
        };       
        const config = {
          headers: {
            Authorization: `Bearer ${user && user.token}`,
            "Content-Type": "application/json"
          }          
        };      
       
        const response = await axiosInstance.post('appointments/auth-user', data, config);
        if (response.data) {
          toast.success(response.data.message);
        }
      } catch (error) {
        let errorMessage = 'Failed to book appointment.';
        if (error.response) {
          if (error.response.status === 401 && error.response.data.message)
            errorMessage = error.response.data.message;
          if (error.response.status === 403 && error.response.data.message)
            errorMessage = error.response.data.message;
          if (error.response.status === 400 && error.response.data.message)
            errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  async function fetchAppointmentTypes() {
    try {
     
      const response = await axiosInstance.get("appointments/types");
      if (response.data) {
        setAppointmentTypes(response.data);
      }
    } catch (error) {
     
    } finally {
     
    }
  }

  const fetchProviders = async(specialty) => {
    try {
     
      const response = await axiosInstance.get(`appointments/doctors?specialty=${specialty}`);
      setProviders(response.data);
    } catch (error) {
      
    } finally {
      
    }
  };

  const generateTimeSlots = (duration) => {
    const timeSlots = [];
    const startTime = new Date();
    startTime.setHours(8, 0, 0); // Starting at 8:00 AM

    const endTime = new Date();
    endTime.setHours(17, 0, 0); // Ending at 5:00 PM

    while (startTime < endTime) {
      const slotStartTime = new Date(startTime);
      const slotEndTime = new Date(slotStartTime.getTime() + duration * 60000); // Add duration in minutes

      timeSlots.push({       
        start: slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),      
        display: `${slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });

      startTime.setMinutes(startTime.getMinutes() + duration);
    }

    setAvailableTimeSlots(timeSlots);
  };

  const handleAppointmentTypeChange = (event) => {
    formik.handleChange(event);
    const selectedType = event.target.value;
    if (selectedType) {      
      const selectedAppointmentType = appointment_types.find(type => type.id === Number(selectedType));
      if (selectedAppointmentType) {
        generateTimeSlots(selectedAppointmentType.duration);
      }
    }
  };

  useEffect(() => {
    setMinDateTime(getCurrentDateTimeLocal().slice(0, 10)); // Set minimum date to current date
    fetchAppointmentTypes();
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <div className="container py-2">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary py-4">
            <div className="card-header">
              <div className="card-title">
                <h3 className="card-text">Book Appointment Form</h3>
              </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="card-body">
                <div className="row">
                <div className='col-md-6 mb-3'>
                                 <label htmlFor="specialtySelect">Select Speciality</label>
                                     <Select                                         
                                         options={doctorSpecialties}
                                         value={selectedSpecialty}
                                         onChange={ handleSpecialtyChange}
                                         id="specialtySelect"
                                         name="specialty"
                      className={formik.errors.specialty ? 'form-control is-invalid' : 'form-control'}
                   
                                     />    
                                     {formik.errors.specialty ? (
                      <div className="invalid-feedback">{formik.errors.specialty}</div>
                    ) : null}                             
                                 </div>

                                 <div className="form-group col-md-6">
                    <label htmlFor="provider">Provider</label>
                    <select
                      id="provider"
                      name="provider"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.provider}
                    >
                      <option value="">Select provider</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                      ))}
                    </select>
                    {formik.touched.provider && formik.errors.provider ? (
                      <div className="text-danger">{formik.errors.provider}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="appointmentType">Appointment Type</label>
                    <select
                      id="appointmentType"
                      name="appointmentType"
                      className="form-control"
                      onChange={handleAppointmentTypeChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.appointmentType}
                    >
                      <option value="">Select appointment type</option>
                      {appointment_types.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {formik.touched.appointmentType && formik.errors.appointmentType ? (
                      <div className="text-danger">{formik.errors.appointmentType}</div>
                    ) : null}
                  </div>
                

                  <div className="form-group col-md-6">
                    <label htmlFor="appointmentDate">Appointment Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      id="appointmentDate"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.appointmentDate}
                      min={minDateTime}
                    />
                    {formik.touched.appointmentDate && formik.errors.appointmentDate ? (
                      <div className="text-danger">{formik.errors.appointmentDate}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="appointmentTime">Appointment Time</label>
                    <select
                      id="appointmentTime"
                      name="appointmentTime"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.appointmentTime}
                    >
                      <option value="">Select time slot</option>
                      {availableTimeSlots.map((slot, index) => (
                        <option key={index} value={slot.display}>{slot.display}</option>
                      ))}
                    </select>
                    {formik.touched.appointmentTime && formik.errors.appointmentTime ? (
                      <div className="text-danger">{formik.errors.appointmentTime}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <Link href="/patient/appointments" className="btn btn-secondary float-start">Back</Link>
                <button type="submit" className="btn btn-primary float-end" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
