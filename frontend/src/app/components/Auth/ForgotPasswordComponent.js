"use client"
import { forgotPassword, loadUserFromLocalStorage, reset } from '@/redux/features/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateEmail } from '../../libs/validateEmail';
import { toast } from 'react-toastify';
export default function ForgotPasswordComponent() {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, message, isError } = useSelector(state => state.auth);
  const router = useRouter();
const [email,setEmail] = useState('')
  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) {
     return toast.error("email address required");
    }
    if (!validateEmail(email)) {
      return  toast.error("Add a valid email address");
    }
    dispatch(forgotPassword({ email }));
}

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {  
    if (isError) {
      toast.error(message.message);
    }
    if (isSuccess) {
      toast.success(message.message);
    }
    if (!isLoading && user) {     
      if (user.role === "admin") {
        router.push("/admin");
      }
      if (user.role === "user") {
        router.push("/patient");
      }
      if (user.role === "doctor") {
        router.push("/doctor");
      }
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, router, dispatch]);

  if (isLoading) {
    return <div>Loading ...</div>
  }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Forgot Password</h2>
              <form onSubmit={onSubmit} autoComplete='off'>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" id="email" />
                </div>                
                <button type="submit" className="btn btn-primary btn-lg btn-block">Forgot Password</button>
              </form>
            </div>
            <div className="card-footer text-center py-3">
            <small>
                Don't have an account? <Link href="/auth/register">Sign up</Link><br />
                Already have an account? <Link href="/auth/login"> Login</Link> <br />
                 <Link href="/"> Home</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


