'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, loadUserFromLocalStorage, reset, updateUser } from '@/redux/features/auth';
import { updateUserValidationSchema } from '@/app/validations/userValidationSchema';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Link from 'next/link';
export default function EditUserComponent() {
    const { id } = useParams();
    const router = useRouter();
    const { user, userInfo, message, isError, isSuccess, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const formik = useFormik({
      initialValues: {
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: userInfo?.phone || '',
        role: userInfo?.role || '',
        dob: userInfo?.dob || '',
        gender: userInfo?.gender || '',
        street: userInfo?.street || '',
        city: userInfo?.city || '',
        state: userInfo?.state || '',
        zipcode: userInfo?.zipcode || '',
        newPassword: '',
        confirmPassword: '',
      },
      validationSchema: updateUserValidationSchema,
      enableReinitialize: true,
      onSubmit: async (values, { setSubmitting }) => {
        try {
          await dispatch(updateUser({ id: userInfo.id, ...values }));
        } catch (err) {
          console.log('Error updating user:', err);
          toast.error('Error updating user');
        } finally {
          setSubmitting(false);
        }
      },
  });
    useEffect(() => {
      if (user && id) {
          dispatch(getUser(id));
        }   
    }, [dispatch,user, id]);

    
  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
        router.push("/auth/login");
    } else if (!isLoading && (user.role === "user" || user.role === "patient")) {
        router.push("/");
    }
}, [user, isLoading, router]);

useEffect(() => {
    if (isError) {
        toast.error(message.message);
    }
    if (isSuccess) {
        toast.success('User updated successfully');
        router.push('/admin/users');
    }
    dispatch(reset());
}, [isSuccess, isError, message, dispatch, router]);
  
    if (isLoading) {
        return<div>Loading ...</div>
    }
  return (
    <div className="card card-primary py-4">
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-text">Update User</h3>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} autoComplete='off' >
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
                readOnly
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
            <p className="text-danger py-2">Change Password is necessary</p>

            <div className="col-md-6">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="form-control"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="text-danger">{formik.errors.newPassword}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-danger">{formik.errors.confirmPassword}</div>
              )}
            </div>
          </div>
        </div>

        <div className="card-footer">
          <Link href="/admin/users" className="btn btn-dark float-start">
            Back
          </Link>
          <button
            type="submit"
            className="btn btn-primary float-end"
            disabled={formik.isSubmitting || isLoading}
          >
            {formik.isSubmitting || isLoading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );

}