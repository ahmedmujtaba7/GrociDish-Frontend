import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosConfig';

export interface Role {
  is_recipe_selector: boolean;
  is_grocery_generator: boolean;
  is_owner: boolean;
}

// Thunk to handle user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/authenticate', credentials);
      const { token, user } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);

      return { token, user }; // Return token and user to Redux
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Thunk to register a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Thunk to verify a user
export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/verifyUser', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

// Thunk to check if user has a family
export const hasFamily = createAsyncThunk(
  'auth/hasFamily',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await axiosInstance.get('/users/hasFamily', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response of hasFamily is",response.data);  
      return response.data.response; // Assuming it returns { hasFamily: boolean }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch family status');
    }
  }
);

export const hasHealthProfile = createAsyncThunk(
  'auth/hasHealthProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log("token at health profile ", token);
      
      const response = await axiosInstance.get('/users/hasHealthProfile', {
        headers: { Authorization: `Bearer ${token}` },
      });
           
      return response.data.response; // Assuming it returns { hashealthProfile: boolean }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch health profile status');
    }
  }
);

// Thunk to get user role
export const getUserRole = createAsyncThunk(
  'auth/getUserRole',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('/roles/getRole', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const role: Role = response.data.role; // Ensure the response matches the Role type
      return role;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user role');
    }
  }
);

// Thunk to update the user's password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (
    data: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      console.log(data)
      const token = await AsyncStorage.getItem('authToken'); // Retrieve auth token
      const response = await axiosInstance.put(
      '/users/update-password',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data)
      return response.data; // Return the API response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password update failed');
    }
  }
);


// Slice to handle authentication state
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null as string | null,
    hasFamily: null as boolean | null,
    hasHealthProfile: null as boolean | null,
    role: null as Role | null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.hasFamily = null;
      state.hasHealthProfile = null;
      state.role = null;

      // Remove token from AsyncStorage
      AsyncStorage.removeItem('authToken').catch((error) => {
        console.error('Failed to remove token from AsyncStorage:', error);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register reducers
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Verify code reducers
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // hasFamily reducers
      .addCase(hasFamily.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hasFamily.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFamily = action.payload.hasFamily;
      })
      .addCase(hasFamily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // hasHealthProfile reducers
      .addCase(hasHealthProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hasHealthProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasHealthProfile = action.payload.hasHealthProfile;
      })
      .addCase(hasHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // getUserRole reducers
      .addCase(getUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action.payload as Role;
      })
      .addCase(getUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        // You can add any state updates if required
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError, logout } = authSlice.actions;
export default authSlice.reducer;
