"use client"
import axiosInstance from '@/app/libs/axios';
import { logoutAsync } from '@/redux/features/auth';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import Link from 'next/link';
import EventModal from './EventModal'; 

const localizer = momentLocalizer(moment);

const EventComponent = ({ event, onClickEvent }) => {
  const formattedStartTime = moment(event.start).format('h:mm A');
  const formattedEndTime = moment(event.end).format('h:mm A');

  return (
      <div   onClick={() => onClickEvent(event)}
      style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', border: '1px solid #ddd' }}>
          <strong style={{ display: 'block', marginBottom: '5px', color: '#333' }}>{event.title}</strong>
          <div style={{ marginBottom: '5px', color: '#666' }}>{event.specialty}</div>
          <div style={{ marginBottom: '5px', color: '#333' }}>
              {formattedStartTime} - {formattedEndTime}
          </div>
          <div style={{ color: '#007bff' }}>
              {event.patient} with Dr. {event.doctor}
          </div>
      </div>
  );
};


export default function PatientDashBoardComponent() {   
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useSelector(state=>state.auth);
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch()
    const[reports, setReports] = useState({ upcomingCount: 0, completedCount: 0, remindersCount: 0, prescriptionsCount:0 });

  // open event modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleEventClick = (event) => {
      setSelectedEvent(event);
      setShowModal(true);
  };
  const handleCloseModal = () => {
      setShowModal(false);
      setSelectedEvent(null);
  };

    const getAllAppointments = async (userToken) => {
        try {
          setIsLoading(true);
          const apiRes = await axiosInstance.get('appointments/auth-doctor/appointments', {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          setAppointments(apiRes.data.appointments);
        } catch (error) {
        //  let errorMessage = 'Failed to fetch appointments.';
          if (error.response && error.response.status === 401) {
            dispatch(logoutAsync());
          }else if(error.response && error.response.status === 400 || error.response && error.response.status === 403){          
            //  errorMessage = error.response.data.message;          
          }
       //   toast.error(errorMessage);
          return;
        } finally {
        setIsLoading(false);
        }
      };
    
      

      const formatEvents = () => {
        return appointments.map(appointment => ({
            id: appointment.id,
            title: appointment.AppointmentType.name,     
            start: new Date(`${appointment.appointmentDate}T${moment(appointment.startTime, 'HH:mm:ss').format('HH:mm')}`),
            end: new Date(`${appointment.appointmentDate}T${moment(appointment.endTime, 'HH:mm:ss').format('HH:mm')}`),   
            allDay: false,
            status: appointment.status,
            specialty: appointment.specialty,
            doctor: appointment.doctor.name,
            patient: appointment.patient.name,
        }));
    };

  
  const fetchPatientReports =async(token)=>{
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("appointments/reports", {headers:{
        Authorization:`Bearer ${token}`
      }});   
      if(response.data){
        setReports({
          upcomingCount:response.data.upcomingCount,
          completedCount:response.data.completed,
          remindersCount: response.data.remindersCount,
          prescriptionsCount:response.data.prescriptionsCount,
        });
      }
      return response.data;
    } catch (error) {     
    //  let errorMessage = 'Failed to fetch patient reports.';
      if (error.response && error.response.status === 401) {
        dispatch(logoutAsync());
      } else if (error.response && (error.response.status === 400 || error.response.status === 403)) {
      //  errorMessage = error.response.data.message;
      }
  //    toast.error(errorMessage);
      return;
    } finally {
      setIsLoading(false);
    }    
  }

  useEffect(() => {
    if(user && user.token){
      getAllAppointments(user.token);
    fetchPatientReports(user.token)
    }
  }, [user]);

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Doctor Dashboard</h1>
            </div>

            <div className="row">
        {[
          { title: 'Upcoming Appointments', count: reports.upcomingCount, link: '/doctor/appointments' },
          { title: 'Completed Appointments', count: reports.completedCount, link: '/doctor/appointments' },
          { title: 'Reminders', count: reports.remindersCount, link: '/doctor/reminders' },         
          { title: 'Prescriptions', count: reports.prescriptionsCount, link: '/doctor/medical-history' }
        ].map((item, index) => (
          <div className="col-md-3" key={index}>
              <Link href={item.link} className="text-decoration-none">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title" style={{
                  fontSize:15
                }}>{item.title} </h5>
                <p className="card-text"> <span className="badge bg-primary">{item.count}</span></p>
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Appointment Schedule</h5>
                           
                            <div style={{ height: '500px' }}>
                                <Calendar
                                    localizer={localizer}
                                    events={formatEvents()}
                                    startAccessor="start"
                                    endAccessor="end"
                                    views={['month', 'agenda']}
                                    style={{ width: '100%', height: '100%' }}
                                    eventPropGetter={(event) => {
                                        let style = {
                                            bgClass : 'bg-primary',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '5px',
                                            marginBottom: '5px'
                                        };

                                        if (event.status === 'cancelled') {
                                            style.bgClass = 'bg-danger'; 
                                        }

                                        return { style };
                                    }}
                                    components={{
                                      event: (props) => <EventComponent {...props} onClickEvent={handleEventClick} />
                                  }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>

      
            <div className="row">
      <div className="col-md-6">
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Quick Actions</h5>
            <div className="row">
              <div className="col-md-6 mb-2">
                <Link href="/doctor/appointments/create" className="btn btn-primary w-100 py-2">
                 Book Appointment
                </Link>
              </div>
              <div className="col-md-6 mb-2">
                <Link href="/doctor/medical-history" className="btn btn-success w-100 py-2">Medical History
                </Link>
              </div>
              {/* Add more buttons here as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>

    {selectedEvent && (
                <EventModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    event={selectedEvent}
                />
            )}

        </>
    );
}

