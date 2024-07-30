
"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync, reset } from '@/redux/features/auth';

const Sidebar = () => {
  const { user, isLoading, } = useSelector(state => state.auth);
  const [userLoaded, setUserLoaded] = useState(false);
  const dispatch = useDispatch();  
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAsync());
    dispatch(reset()); 
  };


  useEffect(() => {
    if (user && !isLoading) {
      setUserLoaded(true);
    }
  }, [user, isLoading]);



  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar"  >
                <div className="sidebar-sticky">
        <ul className="nav flex-column">         
                <li className="nav-item">
                      <Link className="nav-link active" href="/doctor">
                   Doctor  Dashboard
                      </Link>
                  </li>
                 
                    <li className="nav-item">
                      <Link className="nav-link" href="/doctor/appointments">
                        Appointments
                      </Link>
                    </li>
                    
                    <li className="nav-item">
                      <Link className="nav-link" href="/doctor/appointments/types">
                        Appointment Types
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" href="/doctor/medical-history">
                       Medical History
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" href="/doctor/specialties">
                       My Specialties
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/doctor/reminders">
                        Reminders
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
