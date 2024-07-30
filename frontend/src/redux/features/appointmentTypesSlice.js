import axiosInstance from '@/app/libs/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointmentTypes: [],
  isLoading:false,
  isError:false,
  message:"",
  isSuccess:false,
};

export const appointmentTypesSlice = createSlice({
  name: 'appointmentTypes',
  initialState,
  reducers: {
  
    appointmentTypeReset:(state)=>{
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.message = ""
    },
  },
  extraReducers:(builder)=>{
    builder
    .addCase(getAppointmentTypes.pending, (state) => {
      state.isLoading =true;
    })
    .addCase(getAppointmentTypes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.appointmentTypes = action.payload;
    })
    .addCase(getAppointmentTypes.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload     
    })    

},
});

export const getAppointmentTypes = createAsyncThunk(
    'appointmentTypes/all',
    async (_, thunkAPI) => {
      try {       
            const response = await axiosInstance.get(`appointments/types`);                 
            return response.data;
        } catch (error) {
            let message;       
        if(error.response){
            if(error.response.status === 400){
                message = error.response.data.message;
            }
            if(error.response.status === 404){
                message = "Resource not found";
            }
            if(error.response.status === 500){
                message = "Internal Server error";
            }
        }
         return thunkAPI.rejectWithValue(message);
      
        }
  });

export const {appointmentTypeReset} =   appointmentTypesSlice.actions;
export const selectAppointmentTypes = (state) => state.appointmentTypes.appointmentTypes;

export default appointmentTypesSlice.reducer;
