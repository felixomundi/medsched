"use client"
import { loadUserFromLocalStorage, reset, resetPassword } from '@/redux/features/auth';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const ResetPasswordComponent = () => {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const { user, isLoading, message, isError, isSuccess } = useSelector(state => state.auth);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      return toast.error("Password cant be empty");
    }
    if (password.length < 8) {
      return toast.error("Password must be up to 8 characters");
    }
    if (password !== confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    const data = {
      token,
      password
    }
    dispatch(resetPassword(data));
    
  };
  useEffect(() => {   
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {  
    if (isError) {
      toast.error(message.message);
    }
    if (isSuccess) {
      toast.success(message.message);
      router.push("/auth/login")
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
    return <div>Loading ...</div>;
}
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Reset Password</h2>
              <form onSubmit={handleSubmit} autoComplete='off'>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password"
                    name='password'
                  value={password}
            onChange={(e) => setPassword(e.target.value)}
            required className="form-control" id="password" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                  <input type="password"                    
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    name='confirm_password'
                    className="form-control" id="confirm_password" />
                </div>              
                <button type="submit" className="btn btn-primary btn-lg btn-block">Reset Password</button>
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

export default ResetPasswordComponent;
