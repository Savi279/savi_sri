import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerFavoritesApi } from '../api/customer_api';

// Async thunks for favorites operations
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerFavoritesApi.getFavorites();
      return response.products || []; // Return the 'products' array from the response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await customerFavoritesApi.addToFavorites(productId);
      return response.products || []; // Return the 'products' array from the response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await customerFavoritesApi.removeFromFavorites(productId);
      return response.products || []; // Return the 'products' array from the response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [], // Array of favorite product objects
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Payload is the entire favorites items array
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items = action.payload; // Payload is the updated favorites items array
      })
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = action.payload; // Payload is the updated favorites items array
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectIsFavorite = (state, productId) =>
  state.favorites.items.some(item => item._id === productId); // Check by _id from backend

export default favoritesSlice.reducer;
