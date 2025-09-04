import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import cartReducer from './cartSlice';
import searchReducer from './searchSlice'; // Import searchReducer
import userReducer from './userSlice';     // Import userReducer
import orderReducer from './orderSlice';   // Import orderReducer

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    search: searchReducer, // Add searchReducer
    user: userReducer,     // Add userReducer
    orders: orderReducer,  // Add orderReducer
  },
});
