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
 
  const { user } = useSelector(state => state.auth);
 
  const formik = useFormik({
    initialValues: {
      name: '',
      duration: '',
      description: '',
      cost: ''
    
    },
       validate: values => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }      
      if (!values.duration) {
        errors.duration = 'Required';
      }else if (!Number.isInteger(Number(values.duration)) || Number(values.duration) < 1) {
        errors.duration = 'Duration must be a positive integer greater than or equal to 1';
      }
      if (!values.cost) {
        errors.cost = 'Required';
      } else if (isNaN(Number(values.cost)) || Number(values.cost) < 0) {
        errors.cost = 'Cost must be a number greater than or equal to 0';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {       
        const data = {
          name: values.name,
          duration: values.duration,
          description: values.description,
          cost: values.cost,
         
        };
        const config = {
          headers: {
            Authorization: `Bearer ${user && user.token}`,
            "Content-Type": "application/json"
          }
        };
        const response = await axiosInstance.put('appointments/types/' 
          + appointment.id, data, config);          
        if (response.data) {
          toast.success(response.data.message);
          getAllAppointments(user && user.token);
         handleClose();
        }

      } catch (error) {
        let errorMessage = 'Failed to update appointment type.';
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

    formik.setValues({
      name: appointment.name,
      duration: appointment.duration,
      cost:appointment.cost,
      description:appointment.description,
    });

  }, [appointment]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Appointment Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('name', (e.target.value));
              }}
              onBlur={formik.handleBlur}            
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="duration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formik.values.duration}
              onChange={(e) => {
                const value = e.target.value;
                // Only update the form state if the value is a positive integer
                if (value === '' || /^[1-9]\d*$/.test(value)) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.duration && !!formik.errors.duration}
              min="1"
            >             
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.duration}
            </Form.Control.Feedback>
          </Form.Group>


          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.description && !!formik.errors.description}
            >             
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="cost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="number"
              name="cost"
              min="0"
              value={formik.values.cost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.cost && !!formik.errors.cost}
            >             
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.cost}
            </Form.Control.Feedback>
          </Form.Group>

          

          <div className="modal-footer">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
             Update
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;
