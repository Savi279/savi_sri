import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerCartApi } from '../api/customer_api';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerCartApi.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await customerCartApi.addItem(itemData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Notify the backend of removal, then handle state on the client
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemIdentifier, { rejectWithValue }) => {
    try {
      // itemIdentifier is { productId, size }
      const response = await customerCartApi.removeItem(itemIdentifier);
      // Return the updated cart from backend
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Notify the backend of a quantity update, then handle state on the client
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, size, quantity }, { rejectWithValue }) => {
    try {
      const response = await customerCartApi.updateItem(productId, size, { quantity });
      // Return the updated cart from backend
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      // Assuming backend has a clear cart endpoint, or we can remove items one by one
      // For now, we'll handle it client-side
      // No return needed, just resolve
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload.products || []).filter(item => item.product); // Filter out items with null product
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Update items and total based on response
        state.items = (action.payload.products || []).filter(item => item.product); // Filter out items with null product
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        // Update items from response
        state.items = (action.payload.products || []).filter(item => item.product); // Filter out items with null product
        // Recalculate total
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // Update items from response
        state.items = (action.payload.products || []).filter(item => item.product); // Filter out items with null product
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.items.reduce((count, item) => count + item.quantity, 0);

// Export the reducer
export default cartSlice.reducer;
