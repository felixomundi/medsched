"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

const timeSlots = [
  '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM',
  '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM',
  '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
  '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
];

const TimeSlotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const TimeSlotButton = styled.button`
  width: 80px;
  height: 40px;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#007bff' : 'white')};
  color: ${(props) => (props.selected ? 'white' : '#007bff')};
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: ${(props) => (props.selected ? '#0056b3' : '#e7f1ff')};
  }
`;

const BookAppointment = () => {
  const [activeTab, setActiveTab] = useState('member');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [errors, setErrors] = useState({
    patientName: '',
    date: '',
    selectedTimeSlot: '',
    doctorId: '',
  });

  const validateMemberStep = () => {
    let hasError = false;
    const newErrors = { ...errors };

    if (!patientName) {
      newErrors.patientName = 'Patient Name is required';
      hasError = true;
    } else {
      newErrors.patientName = '';
    }

    if (!date) {
      newErrors.date = 'Select Date is required';
      hasError = true;
    } else {
      newErrors.date = '';
    }

    setErrors(newErrors);
    return !hasError;
  };

  const validateTimeStep = () => {
    let hasError = false;
    const newErrors = { ...errors };

    if (!selectedTimeSlot) {
      newErrors.selectedTimeSlot = 'Select a Time Slot';
      hasError = true;
    } else {
      newErrors.selectedTimeSlot = '';
    }

    setErrors(newErrors);
    return !hasError;
  };

  const validateDetailsStep = () => {
    let hasError = false;
    const newErrors = { ...errors };

    if (!doctorId) {
      newErrors.doctorId = 'Doctor ID is required';
      hasError = true;
    } else {
      newErrors.doctorId = '';
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleNextStep = () => {
    if (activeTab === 'member' && validateMemberStep()) {
      setActiveTab('time');
    } else if (activeTab === 'time' && validateTimeStep()) {
      setActiveTab('details');
    } else if (activeTab === 'details' && validateDetailsStep()) {
      setActiveTab('confirm');
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'time') {
      setActiveTab('member');
    } else if (activeTab === 'details') {
      setActiveTab('time');
    } else if (activeTab === 'confirm') {
      setActiveTab('details');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      doctorId,
      date,
      selectedTimeSlot,
      patientName,
    });
    // Handle submission logic here
  };

  useEffect(() => {
    // Ensure Bootstrap JS is loaded only on the client side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  // Disable confirmation button if any previous tab is invalid
  const isPreviousTabInvalid = activeTab !== 'member' && (
    errors.patientName || errors.date || errors.selectedTimeSlot || errors.doctorId
  );

  return (
    <div className="container">
      <h2>Book an Appointment</h2>

      {/* Tab panes */}
      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'member' ? 'show active' : ''}`}>
          <h3>1. Member & Date</h3>
          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                setErrors({ ...errors, patientName: '' });
              }}
            />
            {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
          </div>
          <div className="form-group">
            <label>Select Date *</label>
            <input
              type="date"
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors({ ...errors, date: '' });
              }}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>
          <div className="mt-3">
            <button className="btn btn-secondary me-2" onClick={handlePrevStep} disabled={activeTab === 'member'}>
              Back
            </button>
            <button
              type="button"
              className={`btn btn-primary ${errors.patientName || errors.date ? 'disabled' : ''}`}
              onClick={handleNextStep}
              disabled={!patientName || !date}
            >
              Continue
            </button>
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'time' ? 'show active' : ''}`}>
          <h3>2. Time</h3>
          <TimeSlotsContainer>
            {timeSlots.map((slot, index) => (
              <TimeSlotButton
                key={index}
                selected={selectedTimeSlot === slot}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                {slot}
              </TimeSlotButton>
            ))}
          </TimeSlotsContainer>
          {errors.selectedTimeSlot && <div className="invalid-feedback">{errors.selectedTimeSlot}</div>}
          <div className="mt-3">
            <button className="btn btn-secondary me-2" onClick={handlePrevStep}>
              Back
            </button>
            <button
              type="button"
              className={`btn btn-primary ${errors.selectedTimeSlot ? 'disabled' : ''}`}
              onClick={handleNextStep}
              disabled={!selectedTimeSlot}
            >
              Continue
            </button>
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'details' ? 'show active' : ''}`}>
          <h3>3. Details</h3>
          <div className="form-group">
            <label>Doctor ID</label>
            <input
              type="text"
              className={`form-control ${errors.doctorId ? 'is-invalid' : ''}`}
              value={doctorId}
              onChange={(e) => {
                setDoctorId(e.target.value);
                setErrors({ ...errors, doctorId: '' });
              }}
            />
            {errors.doctorId && <div className="invalid-feedback">{errors.doctorId}</div>}
          </div>
          <div className="mt-3">
            <button className="btn btn-secondary me-2" onClick={handlePrevStep}>
              Back
            </button>
            <button
              type="button"
              className={`btn btn-primary ${errors.doctorId ? 'disabled' : ''}`}
              onClick={handleNextStep}
              disabled={!doctorId}
            >
              Continue
            </button>
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'confirm' ? 'show active' : ''}`}>
          <h3>4. Done</h3>
          <p>Patient Name: {patientName}</p>
          <p>Date: {date}</p>
          <p>Time Slot: {selectedTimeSlot}</p>
          <p>Doctor ID: {doctorId}</p>
          <div className="mt-3">
            <button className="btn btn-secondary me-2" onClick={handlePrevStep}>
              Back
            </button>
            <button type="submit" form="appointmentForm" className="btn btn-primary" onClick={handleSubmit} disabled={isPreviousTabInvalid}>
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
