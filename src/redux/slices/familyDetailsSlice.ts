import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosConfig';

interface FamilyMember {
  id: number;
  name: string;
  is_owner: boolean;
  is_grocery_generator: boolean;
  is_recipe_selector: boolean;
}

interface FamilyState {
  familyDetails: {
    member_count: number;
    is_complete: boolean;
    members: FamilyMember[];
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FamilyState = {
  familyDetails: null,
  isLoading: false,
  error: null,
};

export const fetchFamilyDetails = createAsyncThunk(
  'familyDetails/fetchFamilyDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      const response = await axiosInstance.get('/family/getFamilyDetails', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch family details');
    }
  }
);

const familyDetailsSlice = createSlice({
  name: 'familyDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilyDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFamilyDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.familyDetails = action.payload;
      })
      .addCase(fetchFamilyDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default familyDetailsSlice.reducer;
