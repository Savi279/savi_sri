import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/customer_api'; // Assuming this is your authenticated API service
// Import customer_api for login/register/getUser if this is for the customer-facing site
// import { customerAuthApi } from '../api/customer_api'; 

// Async thunks for user operations
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Use the appropriate API for customer login
      const response = await api.post('/auth/login', credentials); // Backend login endpoint
      localStorage.setItem('token', response.token); // Store token
      return response; // Return the full response object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Use the appropriate API for customer registration
      const response = await api.post('/auth/register', userData); // Backend registration endpoint
      localStorage.setItem('token', response.token); // Store token
      return response; // Return the full response object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to request OTP (can be part of register flow or password reset)
export const requestOtp = createAsyncThunk(
  'user/requestOtp',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/request-otp', emailData); // Backend OTP request endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to verify OTP
export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', otpData); // Backend OTP verification endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      // This should fetch user data using the stored token
      const response = await api.get('/auth/user'); // Backend endpoint to get logged-in user details
      console.log('fetchUser response:', response);
      return response; // Assuming response is the user object directly
    } catch (error) {
      localStorage.removeItem('token'); // Clear token if fetching user fails (e.g., expired token)
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token'); // Clear token on logout
    },
    setCurrentUser: (state, action) => { // Added for direct setting of user data if needed
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user; // Set current user on successful login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user; // Set current user on successful registration
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP request itself doesn't change auth state, just indicates success
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP verification itself doesn't change auth state directly, leads to login/register form
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // User is not authenticated if fetch fails
        state.currentUser = null;
      });
  },
});

export const { logoutUser, setCurrentUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
