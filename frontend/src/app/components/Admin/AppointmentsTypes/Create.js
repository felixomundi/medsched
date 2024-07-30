"use client"
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/app/libs/axios';
import { toast } from 'react-toastify';

export default function CreateAppointmentTypeComponent() {
const dispatch = useDispatch()
    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        description: Yup.string(),
        duration: Yup.number().required('Required').positive('Duration must be positive').integer('Duration must be an integer'),
        cost: Yup.number().required('Required').positive('Cost must be positive'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            duration: '',
            cost: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
               
                const response =  await axiosInstance.post("appointments/types", values);
                if(response.data.message){
                    toast.success(response.data.message);
                }
                return response.data;
            } catch (error) {
                console.log(error)
                let message;       
               if(error.response){
            if(error.response.status === 400){
                message = error.response.data.message;
            }
            if(error.response.status === 404){
                message = "Resource not found";
            }
            if(error.response.status === 500){
                message = "Internal Server error";
            }
        }
         return toast.error(message)
            } finally {
                setSubmitting(false);
                resetForm()
            }
        },
    });

    return (
        <Container className="py-2">
            <Card className="card-primary py-4">
                <Card.Header>
                    <Card.Title>Add Appointment Type Form</Card.Title>
                </Card.Header>
                    <form onSubmit={formik.handleSubmit} autoComplete='off'>
                <Card.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-danger">{formik.errors.name}</div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <div className="text-danger">{formik.errors.description}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="duration">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    className="form-control"
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.duration && formik.errors.duration && (
                                    <div className="text-danger">{formik.errors.duration}</div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="cost">Cost</label>
                                <input
                                    type="text"
                                    name="cost"
                                    id="cost"
                                    className="form-control"
                                    value={formik.values.cost}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.cost && formik.errors.cost && (
                                    <div className="text-danger">{formik.errors.cost}</div>
                                )}
                            </div>
                        </div>
                </Card.Body>
                        <div className="card-footer py-4">
                            <Link href='/admin/appointments/types'>
                                <p className="btn btn-dark float-start">Back</p>
                            </Link>
                            <Button type="submit" className="btn btn-primary float-end" disabled={formik.isSubmitting}>Add</Button>
                        </div>
                    </form>
            </Card>
        </Container>
    );
}



