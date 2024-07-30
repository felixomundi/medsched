"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync, reset } from '@/redux/features/auth';

const Sidebar = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const [userLoaded, setUserLoaded] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAsync());
    dispatch(reset());
  };

  useEffect(() => {
    // Check if user is loaded and set the state accordingly
    if (!isLoading && user) {
      setUserLoaded(true);
    }
  }, [user, isLoading]);

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          {userLoaded && user && (
            <>
              {user.role === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link active" href="/admin">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {user.role === "user" && (
                <li className="nav-item">
                  <Link className="nav-link active" href="/patient">
                    Patient Dashboard
                  </Link>
                </li>
              )}
              {user.role === "doctor" && (
                <li className="nav-item">
                  <Link className="nav-link active" href="/doctor">
                    Doctor Dashboard
                  </Link>
                </li>
              )}
              {user && (
                <li className="nav-item">
               
               <button className="nav-link" onClick={handleLogout}>Logout</button>
              </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
