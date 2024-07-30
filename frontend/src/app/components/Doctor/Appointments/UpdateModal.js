import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useSelector } from 'react-redux';
import axiosInstance from '@/app/libs/axios';
import { toast } from 'react-toastify';

const UpdateModal = ({ appointment, getAllAppointments, onClose }) => {
  const [minDateTime, setMinDateTime] = useState('');
  const { user } = useSelector(state => state.auth);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  // Helper function to format date
  const formatDate = (date) => {   
   try {
    if (!date) {
      return '';
    }
    const normalizedDate = date.replace(/-/g, '/');
    const d = new Date(normalizedDate);
    if (isNaN(d.getTime())) {
      return ''; // Invalid date format, return empty string
    }
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
   } catch (error) {
    
   }
    
  };

  // Format time function
  function convertTo12HourFormat(timeString) {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
    const match = timeString.match(timeRegex);

    if (!match) {
      return null;
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 or 12 to 12, and 13-23 to 1-11

    // Format the time as "hh:mm AM/PM"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
  }

  const formik = useFormik({
    initialValues: {
      provider: '',
      appointmentType: '',
      appointmentDate: '',
      appointmentTime: '',
      specialty:'',
    },
       validate: values => {
      const errors = {};
      if (!values.appointmentDate) {
        errors.appointmentDate = 'Required';
      }else {
        const isValidDate = !isNaN(new Date(values.appointmentDate).getTime());
        if (!isValidDate) {
          errors.appointmentDate = 'Invalid date';
        }
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
          appointmenttypeId: values.appointmentType.id,
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

        const response = await axiosInstance.put('appointments/reschedule/' 
          + appointment.id, data, config);

        if (response.data) {
          toast.success(response.data.message);
          getAllAppointments(user && user.token);
          handleClose();
        }

      } catch (error) {
        let errorMessage = 'Failed to reschedule appointment. Please try again later.';
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
      }
    },
  });

  useEffect(() => {
    const bookedStartTime = convertTo12HourFormat(appointment.startTime);
    const bookedEndTime = convertTo12HourFormat(appointment.endTime);
    const bookedTimeSlot = `${bookedStartTime} - ${bookedEndTime}`;

    formik.setValues({
      provider: appointment.doctor.id,
      appointmentType: appointment.AppointmentType,
      appointmentDate: formatDate(appointment.appointmentDate),
      appointmentTime: bookedTimeSlot,
      specialty:appointment.specialty
    });

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

    const appointmentType = appointment.AppointmentType;
    const duration = appointmentType.duration;
    if (duration) {
      generateTimeSlots(duration);
    }
    setMinDateTime(getCurrentDateTimeLocal().slice(0, 10)); // Set minimum date to current date
  }, [appointment]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reschedule Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="appointmentDate">
            <Form.Label>New Appointment Date</Form.Label>
            <Form.Control
              type="date"
              name="appointmentDate"
              value={formik.values.appointmentDate}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('appointmentDate', formatDate(e.target.value));
              }}
              onBlur={formik.handleBlur}
              min={minDateTime}
              isInvalid={formik.touched.appointmentDate && !!formik.errors.appointmentDate}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.appointmentDate}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="appointmentTime">
            <Form.Label>Appointment Time</Form.Label>
            <Form.Control
              as="select"
              name="appointmentTime"
              value={formik.values.appointmentTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.appointmentTime && !!formik.errors.appointmentTime}
            >
              <option value="">Select time slot</option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={slot.display}>{slot.display}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.appointmentTime}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="modal-footer">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
              Reschedule
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;
