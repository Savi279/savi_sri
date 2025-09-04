import { useSelector, useDispatch } from 'react-redux';
import { 
  addToFavorites, 
  removeFromFavorites, 
  fetchFavorites, // Also import fetchFavorites
  selectFavorites, 
  selectFavoritesCount,
  selectIsFavorite // Import the new selector
} from '../store/favoritesSlice';
import { useEffect } from 'react';

export const useFavorites = () => {
  const dispatch = useDispatch();
  
  const favorites = useSelector(selectFavorites);
  const favoritesCount = useSelector(selectFavoritesCount);
  
  // Fetch favorites on component mount (or when user logs in)
  useEffect(() => {
    // You might want to conditionally dispatch this based on user authentication status
    // For now, it fetches when the hook is used.
    dispatch(fetchFavorites()); 
  }, [dispatch]);

  const addFavorite = (productId) => dispatch(addToFavorites(productId));
  const removeFavorite = (productId) => dispatch(removeFromFavorites(productId));
  
  // toggleFavorite will now dispatch either add or remove based on current state
  const toggleFavorite = (productId) => {
    if (selectIsFavorite(favorites, productId)) { // Check if it's currently a favorite
      dispatch(removeFromFavorites(productId));
    } else {
      dispatch(addToFavorites(productId));
    }
  };
  
  // Refactor isFavorite to be a custom hook that uses useSelector internally
  const useIsFavorite = (productId) => {
    return useSelector(state => selectIsFavorite(state, productId));
  };
  
  return {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    useIsFavorite,
  };
};
