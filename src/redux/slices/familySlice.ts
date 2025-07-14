import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FamilyState {
  isLoading: boolean;
  code: string | null;
  error: string | null;
}

const initialState: FamilyState = {
  isLoading: false,
  code: null,
  error: null,
};

// Thunk to join a family
export const joinFamily = createAsyncThunk(
  'family/joinFamily',
  async (code: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      
      const response = await axiosInstance.post(
        '/family/joinFamily',
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // Assuming { success: true }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join family');
    }
  }
);

// Thunk to create a family
export const createFamily = createAsyncThunk(
  'family/createFamily',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post(
        '/family/createFamily',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.code; // Assuming { code: '123456' }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create family');
    }
  }
);


// Thunk to get the family code
export const getFamilyCode = createAsyncThunk(
  'family/getFamilyCode',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post('/family/getFamilyCode', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.code; // Assuming { code: '123456' }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch family code');
    }
  }
);


const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    resetFamilyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle join family
      .addCase(joinFamily.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinFamily.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(joinFamily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle create family
      .addCase(createFamily.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFamily.fulfilled, (state, action) => {
        state.isLoading = false;
        state.code = action.payload;
      })
      .addCase(createFamily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle get family code
      .addCase(getFamilyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFamilyCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.code = action.payload;
      })
      .addCase(getFamilyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFamilyState } = familySlice.actions;
export default familySlice.reducer;
