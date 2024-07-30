"use client";
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/WelcomeComponent.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromLocalStorage, logoutAsync } from '@/redux/features/auth';
import { useRouter } from 'next/navigation';

const WelcomeComponent = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push('/admin');
      } else if (user.role === "user") {
        router.push('/patient');
      }
      else if (user.role === "doctor") {
        router.push('/doctor');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (user && !["admin", "patient", "user", "doctor"].includes(user.role)) {
      dispatch(logoutAsync());
    }
  }, [user, dispatch]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroOverlay}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className={styles.heroContent}>
                <img src="/images/calendar.png" alt="Welcome" className={styles.heroImage} />
                <h1 className="display-6 py-3">Welcome to Medsched</h1>
                <p className="lead mt-3">Your trusted partner in healthcare management.</p>
                {!isLoading && user && user.role === "user" && (
                  <Link href="/patient">
                    <button className="btn btn-primary btn-lg mt-4">Get Started</button>
                  </Link>
                )}
                {!user && !isLoading && (
                  <Link href="/auth/login">
                    <button className="btn btn-primary btn-lg mt-4">Get Started</button>
                  </Link>
                )}
                {!isLoading && user && user.role === "admin" && (
                  <Link href="/admin">
                    <button className="btn btn-primary btn-lg mt-4">Get Started</button>
                  </Link>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeComponent;
