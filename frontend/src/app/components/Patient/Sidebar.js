"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync, reset } from '@/redux/features/auth';

const Sidebar = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const [userLoaded, setUserLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && !isLoading) {
      setUserLoaded(true);
    }
  }, [user, isLoading]);

  const handleLogout = async(e) => {
    e.preventDefault();
    await dispatch(logoutAsync());
    dispatch(reset()); 
  };

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/patient" className="nav-link active">
              Patient Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/patient/appointments" className="nav-link">
              Appointments
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/patient/appointments/types" className="nav-link">
              Appointment Types
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/patient/reminders" className="nav-link">
              Reminders
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/patient/medical-history" className="nav-link">
             Medical History
            </Link>
          </li>        
          
          
          {userLoaded && user && (
            <li className="nav-item">
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
