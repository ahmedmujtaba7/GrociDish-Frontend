import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalorieState {
    isLoading: boolean;
    calories: string | null;
    error: string | null;
}

const initialState: CalorieState = {
    isLoading: false,
    calories: null,
    error: null,
};

export const fetchCalorieStats = createAsyncThunk(
  'calorie/fetchCalorieStats',
  async (_, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      const response = await axiosInstance.post(
        '/caloric/getCaloricInfo',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("calories: ",response.data.caloricData)
      return response.data.caloricData;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch calorie stats');
    }
  }
);

const calorieSlice = createSlice({
  name: 'calorie',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalorieStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalorieStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calories = action.payload;
      })
      .addCase(fetchCalorieStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default calorieSlice.reducer;
