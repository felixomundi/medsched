"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { logoutAsync, loadUserFromLocalStorage, reset } from '@/redux/features/auth';

const Navbar = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const [userLoaded, setUserLoaded] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAsync());
    dispatch(reset()); // Reset auth state
  };

  useEffect(() => {
    // Dispatch action to load user from local storage
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    // Check if user is loaded and set the state accordingly
    if (user && !isLoading) {
      setUserLoaded(true);
    }
  }, [user, isLoading]);

  return (
    <nav className="navbar navbar-expand-lg bg-primary sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" href="/">
          Medshed
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link  className="nav-link active text-white d-lg-none" href="/">
                Home
              </Link>
            </li>
            {userLoaded && user && (
              <>
                {/* Admin links */}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" href="#">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" href="/admin/users">
                        Users
                      </Link>
                    </li>
                  </>
                )}

                {/* User links */}
                {user.role === 'user' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" href="/patient/appointments">
                        Appointments
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" href="/patient/medical-history">
                        Medical History
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" href="#">
                        Reminders
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
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
                    <a href="#" className="dropdown-item" onClick={handleLogout}>Logout</a>
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
      </div>
    </nav>
  );
};

export default Navbar;
