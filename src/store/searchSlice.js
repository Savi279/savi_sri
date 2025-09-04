import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/customer_api';

// Async thunk for searching products
export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/search', { params: searchParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchQuery: '',
    filters: {
      category: 'All',
      priceRange: { min: 0, max: 10000 },
      sizes: [],
      colors: [],
      ratings: 0,
      brands: [],
      availability: 'all',
      discount: 0
    },
    sortBy: 'relevance',
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        category: 'All',
        priceRange: { min: 0, max: 10000 },
        sizes: [],
        colors: [],
        ratings: 0,
        brands: [],
        availability: 'all',
        discount: 0
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setFilter,
  clearFilters,
  setSortBy,
} = searchSlice.actions;

// Selectors
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectFilters = (state) => state.search.filters;
export const selectSortBy = (state) => state.search.sortBy;
export const selectSearchResults = (state) => state.search.searchResults;

export default searchSlice.reducer;