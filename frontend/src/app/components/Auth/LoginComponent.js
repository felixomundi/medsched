"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { validateEmail } from '../../libs/validateEmail'; 
import { loadUserFromLocalStorage, login,reset } from '@/redux/features/auth';
import Link from 'next/link';

const LoginComponent = () => {
  const [formData, setFormData] = useState({    
    email: "",
    password:"",
  });
  const { email, password } = formData;
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {  
    if (isError) {
      toast.error(message.message);
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
  }, [user, isError,  message, router, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    } else if (!password) {
      return toast.error("Please enter your password");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
   
  };

  // if (isLoading) {
  //   return <div>Loading ...</div>
  // }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={onSubmit} autoComplete='off'>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    className="form-control"
                    id="email"
                    placeholder='Enter Your Email'
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    name="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={onChange}
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
                <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg btn-block">
                  {isLoading ? "Loading Please Wait" : "Login"}
                  </button>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <small>
                Don't have an account? <Link href="/auth/register">Sign up</Link><br />
                <Link href="/auth/forgot-password">Forgot your password?</Link><br />
                <Link href="/"> Home</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
