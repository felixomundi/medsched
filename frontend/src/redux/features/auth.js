import axiosInstance from "@/app/libs/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading:false,
    isError:null,
    user: {},  
    users:[],
    message: null,
    userInfo:{},
    
}


const handleAuthErrors = (error, thunkAPI) => {
  if (error.response.status === 401 || error.response.status === 403) {
    thunkAPI.dispatch(logoutAsync());
    localStorage.removeItem('user');
  }
  return thunkAPI.rejectWithValue(error.response.data);
};
export const loadUserFromLocalStorage = createAsyncThunk(
  'auth/loadUserFromLocalStorage',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user;
    } catch (error) {    
       localStorage.removeItem("user")
      return thunkAPI.rejectWithValue({ message: 'Error loading user from localStorage' });
    }
  }
);
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            const response = await axiosInstance.post("users/register", user);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
              }            
            return response.data;
        } catch (error) {            
            let message;
            if(error.response){
              if(error.response.status === 400 && error.response.data.message){
                message = { message :error.response.data.message }
              }
              else{
                message = {
                  message:"Error in registering account"
                }
              }
            }
            return thunkAPI.rejectWithValue(message)
        }
});    
export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            const response = await axiosInstance.post("users/login", user);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
              }            
            return response.data;
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
});
export const logoutAsync = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {   
    await (localStorage.removeItem('user'));  
    return true;
  } catch (error) {   
    return thunkAPI.rejectWithValue({
      message:'Error in logging out'
    });
  }
});
export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (data, thunkAPI) => {
      try {
          const response = await axiosInstance.post("users/forgot-password", data);                  
          return response.data;
      } catch (error) {
          const message = error.response.data
          return thunkAPI.rejectWithValue(message)
      }
  });
export const resetPassword = createAsyncThunk(
    'auth/reset-password',
    async (data, thunkAPI) => {
        try {
            const response = await axiosInstance.post("users/reset-password/"+ data.token, {password:data.password});                  
            return response.data;
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
  });

// logged actions
export const changePassword = createAsyncThunk(
  'auth/change-password',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          }
        }
          const response = await axiosInstance.patch("users/change-password", data, config);                 
          return response.data;
      } catch (error) {
          // const message = error.response.data
      // return thunkAPI.rejectWithValue(message)
      return handleAuthErrors(error, thunkAPI);
      }
});  
export const getUsers = createAsyncThunk(
  'auth/get-users',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          }
        }
          const response = await axiosInstance.get("users",config);                 
          return response.data;
      } catch (error) {
          // const message = error.response.data
      // return thunkAPI.rejectWithValue(message)
      return handleAuthErrors(error, thunkAPI);
      }
});
export const addUser = createAsyncThunk(
  'auth/add-user',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          }
        }
          const response = await axiosInstance.post("users/create", data, config);                 
          return response.data;
      } catch (error) {
          // const message = error.response.data
      // return thunkAPI.rejectWithValue(message)
      return handleAuthErrors(error, thunkAPI);
      }
});
export const deleteUser = createAsyncThunk(
    'auth/delete-user',
    async (id, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            }
          }
            const response = await axiosInstance.delete("users/delete/"+id, config);                 
            return response.data;
        } catch (error) {
            // const message = error.response.data
        // return thunkAPI.rejectWithValue(message)
        return handleAuthErrors(error, thunkAPI);
        }
});
export const getUser = createAsyncThunk(
  'auth/get-user',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(`users/${id}`, config);
      return response.data;
    } catch (error) {
      const message = error.response.data;
      return thunkAPI.rejectWithValue(message);  
    }
  }
);
  
export const updateUser = createAsyncThunk(
'auth/update-user',
async (userData, thunkAPI) => {
  try {
    const { id, ...updatedUserData } = userData;
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.patch(`users/edit/${id}`, updatedUserData, config);
    return response.data;
  } catch (error) {
    return handleAuthErrors(error, thunkAPI);
  }
}
);

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
      },
      getUsersStart(state) {
        state.isLoading = true;
        state.isError = false;
      },
      getUsersSuccess(state, action) {
        state.users = action.payload;
        state.isLoading = false;
        state.isError = false;
      },
      getUsersFailure(state) {
        state.isLoading = false;
        state.isError = true;
      },
      getUser: (state, action) => {
      return  state.users.filter(user => user.id === action.payload.id);
      },
      updateUserProfileData: (state, action) => {
        state.user = action.payload;
      },
           
    },
    extraReducers:(builder)=>{
      builder
      .addCase(loadUserFromLocalStorage.pending, (state) => {
        state.isLoading =true;
      })
      .addCase(loadUserFromLocalStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loadUserFromLocalStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
        state.user = {}
      })
    .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.message = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })  
      .addCase(logoutAsync.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.message = {
          message:'Logout successful'
        }
      })
      .addCase(logoutAsync.rejected, (state,action ) => {       
        state.user = null;
        state.message = action.payload
        state.isError = true
        state.isLoading = false;
      })
      .addCase(changePassword.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state,action) => {
        state.isLoading = false;        
        state.message = action.payload;
        state.isSuccess = true
      })
      .addCase(changePassword.rejected, (state,action ) => {      
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getUsers.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state,action) => {
        state.isLoading = false;        
        state.message = action.payload;
        state.users = action.payload.users
      })
      .addCase(getUsers.rejected, (state,action ) => {      
        state.message = action.payload
        state.isError = true
        state.isLoading = false
        state.users = []
      })
      .addCase(addUser.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state,action) => {
        state.isLoading = false;  
        state.users.push(action.payload.user);
        state.isSuccess = true;
        state.message = action.payload
      })
      .addCase(addUser.rejected, (state,action ) => {      
        state.message = action.payload
        state.isError = true
        state.isLoading = false     
      })
      .addCase(deleteUser.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state,action) => {
        state.isLoading = false;  
        state.users.filter(user => user.id !== action.payload.id)
        state.isSuccess = true;
        state.message = action.payload
      })
      .addCase(deleteUser.rejected, (state,action ) => {      
        state.message = action.payload;
        state.isError = true
        state.isLoading = false     
      })
      .addCase(forgotPassword.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state,action) => {
        state.isLoading = false;          
        state.isSuccess = true;
        state.message = action.payload
      })
      .addCase(forgotPassword.rejected, (state,action ) => {      
        state.message = action.payload;
        state.isError = true
        state.isLoading = false     
      })
      .addCase(resetPassword.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state,action) => {
        state.isLoading = false;          
        state.isSuccess = true;
        state.message = action.payload
      })
      .addCase(resetPassword.rejected, (state,action ) => {      
        state.message = action.payload;
        state.isError = true
        state.isLoading = false     
      })
      .addCase(getUser.pending, (state) => {      
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state,action) => {
        state.isLoading = false;        
        state.userInfo = action.payload.user;
      })
      .addCase(getUser.rejected, (state,action ) => {      
        state.message = action.payload;
        state.userInfo = {};
        state.isError = true
        state.isLoading = false     
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })      

    },
})

export const {reset, getUsersStart, getUsersSuccess, getUsersFailure,updateUserProfileData} = authSlice.actions;
export const selectUsers = state => state.auth.users;
export default authSlice.reducer;