'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/libs/axios';
import { loadUserFromLocalStorage, updateUserProfileData } from '@/redux/features/auth';

const ProfileComponent = () => {
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    zipcode: '',
    street: '',
    gender: '',
    dob: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    if (user && !formData.name) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        zipcode: user.zipcode || '',
        street: user.street || '',
        gender: user.gender || '',
        dob: user.dob || '',
      });
    }
    if (!user) {
      router.push('/auth/login');
    }
    if (isError) {
      toast.error(message.message);
    }
  }, [user, isError, message, router, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error message for the field being edited
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {  
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,         
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.put("users/profile", formData, config);
      if(response.data.message){
        toast.success(response.data.message);
        // Update user in Redux store
        dispatch(updateUserProfileData(response.data.user));
        // Remove current user data from local storage
        localStorage.removeItem('user');
        // Set new user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    finally{
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-start mb-4">Update Profile</h2>
              {user && !loading && (
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="state" className="form-label">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      />
                      {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="zipcode" className="form-label">Zipcode</label>
                      <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
                      />
                      {errors.zipcode && <div className="invalid-feedback">{errors.zipcode}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="street" className="form-label">Street</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                      />
                      {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label">Gender</label>
                    <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    


                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dob" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                      />
                      {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;



