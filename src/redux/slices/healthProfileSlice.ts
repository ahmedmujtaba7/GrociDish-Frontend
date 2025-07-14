import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosConfig';
import axios from 'axios';

interface HealthProfileState {
  gender: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  activity_level: string | null;
  diseases: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HealthProfileState = {
  gender: null,
  age: null,
  weight: null,
  height: null,
  activity_level: null,
  diseases: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch health profile
export const fetchHealthProfile = createAsyncThunk(
  'healthProfile/fetchHealthProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post('/healthProfile/getHealthProfile', {
        headers: { Authorization: `Bearer ${token}` },
      }); // Replace with actual API endpoint
      console.log(response.data)
      return response.data.healthProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Async thunk to submit health profile
// Add a thunk for creating a health profile
export const createHealthProfile = createAsyncThunk(
  'healthProfile/createHealthProfile',
  async (profileData: Omit<HealthProfileState, 'isLoading' | 'error'>, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post(
        '/healthProfile/createHealthProfile',
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create health profile');
      }
      return rejectWithValue((error as Error).message || 'An unexpected error occurred');
    }
  }
);

// Add a thunk for updating a health profile
export const updateHealthProfile = createAsyncThunk(
  'healthProfile/updateHealthProfile',
  async (profileData: Partial<Omit<HealthProfileState, 'isLoading' | 'error'>>, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      console.log(profileData);
      const response = await axiosInstance.post(
        '/healthProfile/updateHealthProfile',
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update health profile');
      }
      return rejectWithValue((error as Error).message || 'An unexpected error occurred');
    }
  }
);


const healthProfileSlice = createSlice({
  name: 'healthProfile',
  initialState,
  reducers: {
    setGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
    setAge(state, action: PayloadAction<number>) {
      state.age = action.payload;
    },
    setWeight(state, action: PayloadAction<number>) {
      state.weight = action.payload;
    },
    setHeight(state, action: PayloadAction<number>) {
      state.height = action.payload;
    },
    setActivityLevel(state, action: PayloadAction<string>) {
      state.activity_level = action.payload;
    },
    toggleDisease(state, action: PayloadAction<string>) {
      if (state.diseases.includes(action.payload)) {
        state.diseases = state.diseases.filter((disease) => disease !== action.payload);
      } else {
        state.diseases.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHealthProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Update state with the fetched health profile data
        const { gender, age, weight, height, activity_level, diseases } = action.payload;
        state.gender = gender;
        state.age = age;
        state.weight = weight;
        state.height = height;
        state.activity_level = activity_level;
        state.diseases = diseases || [];
      })
      .addCase(fetchHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createHealthProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHealthProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { gender, age, weight, height, activity_level, diseases } = action.payload;
        state.gender = gender;
        state.age = age;
        state.weight = weight;
        state.height = height;
        state.activity_level = activity_level;
        state.diseases = diseases || [];
      })
      .addCase(createHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle updateHealthProfile
      .addCase(updateHealthProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHealthProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setGender,
  setAge,
  setWeight,
  setHeight,
  setActivityLevel,
  toggleDisease,
} = healthProfileSlice.actions;

export default healthProfileSlice.reducer;
