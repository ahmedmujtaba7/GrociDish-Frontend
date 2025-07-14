import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroceryState {
  groceryList: any;
  loading: boolean;
  error: string | null;
}

const initialState: GroceryState = {
  groceryList: null,
  loading: false,
  error: null,
};

// **Thunk: Generate Grocery List**
export const generateGroceryList = createAsyncThunk(
  'grocery/generateGroceryList',
  async (budget: number, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post(
        '/grocery/createGroceryList',
        { budget },
        { headers: { Authorization: `Bearer ${token}` },
        timeout: 360000,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate grocery list');
    }
  }
);

// **Thunk: Fetch Grocery List**
export const fetchGroceryList = createAsyncThunk(
  'grocery/fetchGroceryList',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post('/grocery/getGroceryList', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grocery list');
    }
  }
);

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // **Handle Generate Grocery List**
      .addCase(generateGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        state.groceryList = action.payload;
      })
      .addCase(generateGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // **Handle Fetch Grocery List**
      .addCase(fetchGroceryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        state.groceryList = action.payload;
      })
      .addCase(fetchGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default grocerySlice.reducer;
