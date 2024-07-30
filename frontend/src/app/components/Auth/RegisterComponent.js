"use client"
import { loadUserFromLocalStorage, register, reset } from '@/redux/features/auth';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { validateEmail } from '../../libs/validateEmail';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
const RegisterComponent = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirm_password, setConfirmPassword] = useState('');
    const [gender, setGender] = useState("");
    const [account, setAccountType] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const handleChange = (selectedOptions) => {
        setSelectedSpecialties(selectedOptions || []);
      };
    const doctorSpecialities = [
        { value: "Allergy and Immunology", label: "Allergy and Immunology" },
        { value: "Anesthesiology", label: "Anesthesiology" },
        { value: "Cardiology", label: "Cardiology" },
        { value: "Dermatology", label: "Dermatology" },
        { value: "Emergency Medicine", label: "Emergency Medicine" },
        { value: "Endocrinology", label: "Endocrinology" },
        { value: "Family Medicine", label: "Family Medicine" },
        { value: "Gastroenterology", label: "Gastroenterology" },
        { value: "Geriatrics", label: "Geriatrics" },
        { value: "Hematology", label: "Hematology" },
        { value: "Infectious Disease", label: "Infectious Disease" },
        { value: "Internal Medicine", label: "Internal Medicine" },
        { value: "Nephrology", label: "Nephrology" },
        { value: "Neurology", label: "Neurology" },
        { value: "Obstetrics and Gynecology (OB/GYN)", label: "Obstetrics and Gynecology (OB/GYN)" },
        { value: "Oncology", label: "Oncology" },
        { value: "Ophthalmology", label: "Ophthalmology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Otolaryngology (ENT)", label: "Otolaryngology (ENT)" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Physical Medicine and Rehabilitation (PM&R)", label: "Physical Medicine and Rehabilitation (PM&R)" },
        { value: "Psychiatry", label: "Psychiatry" },
        { value: "Pulmonology", label: "Pulmonology" },
        { value: "Radiology", label: "Radiology" },
        { value: "Rheumatology", label: "Rheumatology" },
        { value: "Surgery", label: "Surgery" },
        { value: "Urology", label: "Urology" }
      ];
    const onSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Please add your full name");
            return
        }
        if (!email) {
            toast.error("Please add your email address");
            return
        }
        if (!validateEmail(email)) {
            toast.error("Please add  a vaild email address");
            return
        }
        if(!gender){
            toast.error("Please select gender");
            return
        }
        if(!account){
            toast.error("Please select account type");
            return
        }
        if (account === "doctor" && selectedSpecialties.length === 0) {
            toast.error("Please select at least one specialty");
            return;
        }

        if (!password) {
            toast.error("Please add  your password");
            return
        }
        if (password.length < 6) {
            toast.error("Password length should not be less than 6");
            return
        }
        if (!confirm_password) {
            toast.error("Please add  confirm password");
            return
        }
        if (password !== confirm_password) {
            toast.error("Passwords don't match");
            return
        }

        const data = {
            name, 
            email,
            password,
            gender, 
            role:account,
            specialties: selectedSpecialties.map(specialty => specialty.value)
        }       

       dispatch(register(data))       
       
    }
    const { user, isLoading, isError, message, isSuccess } = useSelector(state => state.auth);
    const router = useRouter();
    useEffect(() => {
        dispatch(loadUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
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
        if (isError) {
            toast.error(message.message)
        }
        if (isSuccess) {
            toast.success(message.message)
        }
        dispatch(reset());
    },[isLoading,user,router,message])
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4"> 
                            <h2 className="text-center mb-3">Create an Account</h2>
                            <form onSubmit={onSubmit} autoComplete='off'>
                              <div className="row">
                              <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input type="text" name='name' onChange={(e)=>setName(e.target.value)} className="form-control" id="name" placeholder="Enter your full name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" onChange={(e)=>setEmail(e.target.value)} className="form-control" id="email" placeholder="Enter your email address" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select  onChange={(e)=>setGender(e.target.value)} className="form-control" id="gender" >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="AccountType" className="form-label">Account Type</label>
                                    <select  onChange={(e)=>setAccountType(e.target.value)} className="form-control" id="AccountType" >
                                        <option value="">Select Account Type</option>
                                        <option value="user">Patient</option>
                                        <option value="doctor">Doctor</option>                                        
                                    </select>
                                </div>

                               {account === "doctor" && (
                                 <div className='col-md-12 mb-3'>
                                 <label htmlFor="specialitySelect">Select Speciality</label>
                                     <Select
                                         isMulti
                                         options={doctorSpecialities}
                                         value={selectedSpecialties}
                                         onChange={handleChange}
                                         id="specialitySelect"
                                     />                                 
                                 </div>
                               )}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name='password' onChange={(e)=>setPassword(e.target.value)}  className="form-control" id="password" placeholder="Enter your password" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                    <input id="confirm_password" type="password" name='confirm_password' onChange={(e)=>setConfirmPassword(e.target.value)}  className="form-control" placeholder="Confirm your password" />
                                </div>
                              </div>
                                <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg btn-block">
                  {isLoading ? "Loading Please Wait" : "Register"}
                  </button>
                            </form>
                        </div>
                        <div className="card-footer text-center py-2">
                            <small>Already have an account? <Link href="/auth/login">Login</Link></small>
                            <br />
                            <small><Link href="/auth/forgot-password">Forgotten Password?</Link></small> <br />
                            <Link href="/"> Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;

