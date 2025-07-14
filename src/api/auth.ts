import axios from 'axios';

const API_URL = 'http://localhost:4000/users';

// Signup function
export const signupApi = async (data: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' };
  }
};
