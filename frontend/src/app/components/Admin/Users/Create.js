"use client";
import { useFormik } from 'formik';
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { addUser, loadUserFromLocalStorage, reset } from "@/redux/features/auth"; 
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Select from 'react-select';

const Create = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isError, isLoading, message, isSuccess, user } = useSelector(state => state.auth);
  const validate = values => {
    const errors = {};
    // Basic field validations
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errors.email = 'Invalid email address';
    if (!values.phone) errors.phone = 'Phone is required';
    if (!values.role) errors.role = 'Role is required';
    if (!values.password) errors.password = 'Password is required';
    else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!values.dob) errors.dob = 'Date of birth is required';
    if (!values.gender) errors.gender = 'Gender is required';
    if (!values.street) errors.street = 'Street is required';
    if (!values.city) errors.city = 'City is required';
    if (!values.state) errors.state = 'State is required';
    if (!values.zipcode) errors.zipcode = 'Zipcode is required';
    if (values.role === 'doctor' && (!values.specialties || values.specialties.length === 0)) errors.specialties = 'At least one specialty is required';
    return errors;
  };
    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        dob: '',
        gender: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        specialties: []
      },
      validate,
      onSubmit: async(values, {setSubmitting}) => {      
        try {
       // Transform specialties to array of values
    const specialties = values.specialties.map(option => option.value);

    // Log the values to see if they're correct
    console.log('Submitting values:', { ...values, specialties });

    // Dispatch action to add user
    dispatch(addUser({ ...values, specialties }));

        
        } catch (err) {
         
        } finally {
          setSubmitting(false);
        }
      },
    });

    const doctorSpecialities = [
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
  
  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
    if (user && user.role === "user" || user && user.role === "patient") {
      router.push("/");
    }
    dispatch(reset());
  }, [user, router]);

  useEffect(() => {
    if (isSuccess) {     
      toast.success(message.message)
      // formik.resetForm();
    }
    if(isError){
      toast.error(message.message)
    }
    dispatch(reset());
  }, [isSuccess, isError, dispatch, formik]);
  
    return (
      <div className="card card-primary py-4">
        <div className="card-header">
          <div className="card-title">
            <h3 className="card-text">Add User form</h3>
          </div>
        </div>
  
        <form onSubmit={formik.handleSubmit} autoComplete="off">

          
          {/* Display backend error */}
          {isError && <div className="alert alert-danger mt-2">{message.message}</div>}

          <div className="card-body">
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="form-control"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-danger">{formik.errors.phone}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  id="role"
                  className="form-control"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </div>

              {formik.values.role === 'doctor' && (
              <div className="col-md-12">
                <label htmlFor="specialties">Specialties</label>
                <Select
                  isMulti
                  options={doctorSpecialities}
                  value={formik.values.specialties}
                  onChange={selectedOptions => formik.setFieldValue('specialties', selectedOptions)}
                  onBlur={formik.handleBlur}
                  id="specialties"
                  name="specialties"
                />
                {formik.touched.specialties && formik.errors.specialties && (
                  <div className="text-danger">{formik.errors.specialties}</div>
                )}
              </div>
            )}

              <div className="col-md-6">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger">{formik.errors.password}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className="form-control"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <div className="text-danger">{formik.errors.dob}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="gender">Gender</label>
                <select
                  name="gender"
                  id="gender"
                  className="form-control"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-danger">{formik.errors.gender}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="street">Street</label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  className="form-control"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.street && formik.errors.street && (
                  <div className="text-danger">{formik.errors.street}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="form-control"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-danger">{formik.errors.city}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="form-control"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-danger">{formik.errors.state}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="zipcode">Zipcode</label>
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  className="form-control"
                  value={formik.values.zipcode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.zipcode && formik.errors.zipcode && (
                  <div className="text-danger">{formik.errors.zipcode}</div>
                )}
              </div>
            </div>
          </div>
  
          <div className="card-footer">
            <Link href="/admin/users" className="btn btn-dark float-start">
              Back
            </Link>
            <button type="submit" className="btn btn-primary float-end"
            disabled={formik.isSubmitting || isLoading}
            >
             {formik.isSubmitting || isLoading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default Create;


