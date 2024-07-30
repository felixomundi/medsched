"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAsync, reset } from '@/redux/features/auth';
function Navbar() {
  const { user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [userLoaded, setUserLoaded] = useState(false);

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
     {!isLoading && user && user.role === "user" && (
                  <Link href="/patient" className="navbar-brand mr-auto">
                    MedSched
                  </Link>
                )}
                {!user && !isLoading && (
                  <Link href="/auth/login" className="navbar-brand mr-auto">
                    MedSched
                  </Link>
                )}
                {!isLoading && user && user.role === "admin" && (
                  <Link href="/admin" className="navbar-brand mr-auto">
                    MedSched
                  </Link>
                )}

          {!isLoading && user && user.role === "doctor" && (
                  <Link href="/doctor" className="navbar-brand mr-auto">
                    MedSched
                  </Link>
                )}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">          
         
                  <li className="nav-item">
          <Link className="nav-link text-white" href="/admin">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" href="/admin/appointments">
            Appointments
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" href="/admin/appointments/types">
            Appointment Types
          </Link>
        </li>        
        <li className="nav-item">
          <Link className="nav-link text-white" href="/admin/medical-history">
            Medical History
          </Link>
        </li>     
        <li className="nav-item">
          <Link className="nav-link text-white" href="/admin/users">
            Users
          </Link>
        </li>        
        <li className="nav-item">
          <Link className="nav-link text-white" href="/admin/reminders">
           Reminders
          </Link>
        </li>                          
          <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Account
              </Link>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {userLoaded && user && (
                  <>
                    <Link className="dropdown-item" href="/auth/profile">
                      Profile
                    </Link>
                    <Link className="dropdown-item" href="/auth/change-password">
                      Change Password
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </>
                )}                

              {(!userLoaded || !user) && (
                <>
                  <Link className="dropdown-item" href="/auth/login">
                    Login
                  </Link>
                  <Link className="dropdown-item" href="/auth/register">
                    Register
                  </Link>
                </>
              )}
              </div>
            </li>

      </ul>
    </div>
  </nav>
  )
}

export default Navbar