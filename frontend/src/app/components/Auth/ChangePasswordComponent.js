"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { changePassword, loadUserFromLocalStorage, reset } from '@/redux/features/auth';

const ChangePasswordComponent = () => {
  const { user, isLoading, isError, message,isSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmPassword] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current Password cannot be empty')
      return
    }
    if (!newPassword) {
      toast.error('New Password cannot be empty')
      return
    }
    if (!confirmNewPassword) {
      toast.error('Confirm Password cannot be empty')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New Password must be up to 8 characters long')
      return
    }
    if (newPassword != confirmNewPassword) {
      toast.error('Password not matched')
      return
    }
    const data = {
      current_password: currentPassword,
      new_password:newPassword
    }
    dispatch(changePassword(data));    
    dispatch(reset());
   

  }

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  
  useEffect(() => {   
    if (!user) {
      router.push('/auth/login');
    }
    if (isError) {
      toast.error(message.message);
      
    }
    if (isSuccess) {
      toast.success(message.message);      
      router.push("/")
    }
  }, [user, isError, message, router]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-start mb-4">Change Password</h2>
              <form onSubmit={onSubmit} autoComplete='off'>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input type="password" onChange={(e)=>setCurrentPassword(e.target.value)} name="currentPassword" className="form-control" id="currentPassword" />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input type="password" onChange={(e)=>setNewPassword(e.target.value)} name='newPassword' className="form-control" id="newPassword" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input type="password" name='confirmNewPassword' onChange={(e)=>setConfirmPassword(e.target.value)} className="form-control" id="confirmNewPassword" />
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
