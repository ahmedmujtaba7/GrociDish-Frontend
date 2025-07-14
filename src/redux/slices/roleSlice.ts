import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosConfig';

// Types for state
interface FamilyMember {
  id: string; // Unique ID of family member
  name: string; // Name of the family member
}

interface RolesState {
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: RolesState = {
  familyMembers: [],
  isLoading: false,
  error: null,
};

// Thunk to fetch family members
export const fetchFamilyMembers = createAsyncThunk(
  'roles/fetchFamilyMembers',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      const response = await axiosInstance.get('/family/getFamilyNames', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      return response.data.members; // Assuming the API returns a list of family members
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch family members');
    }
  }
);

// Thunk to assign a role
export const assignRole = createAsyncThunk(
  'roles/assignRole',
  async (
    { name, role }: { name: string; role: 'grocery_generator' | 'recipe_selector' },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      const response = await axiosInstance.post(
        '/roles/assign',
        { name, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Assuming success message or updated data is returned
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign role');
    }
  }
);

// Slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch family members
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.familyMembers = action.payload;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Assign role
      .addCase(assignRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignRole.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = rolesSlice.actions;
export default rolesSlice.reducer;
