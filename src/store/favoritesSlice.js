import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    addToFavorites: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(fav => fav.id === item.id);
      if (!existingItem) {
        state.items.push(item);
      }
    },
    removeFromFavorites: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(fav => fav.id === item.id);
      
      if (existingItem) {
        state.items = state.items.filter(fav => fav.id !== item.id);
      } else {
        state.items.push(item);
      }
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites, toggleFavorite } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectIsFavorite = (state, productId) => 
  state.favorites.items.some(item => item.id === productId);

export default favoritesSlice.reducer;
