import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth'
import appointmentTypesReducer from './features/appointmentTypesSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer, 
      appointmentTypes: appointmentTypesReducer,
       
    },
  })
}





