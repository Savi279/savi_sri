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
    // Only fetch favorites if user is logged in
    const token = localStorage.getItem('token');
    console.log('useFavorites - token:', token);
    if (token) {
      dispatch(fetchFavorites())
        .unwrap()
        .then((res) => {
          console.log('fetchFavorites success:', res);
        })
        .catch((err) => {
          console.error('fetchFavorites error:', err);
        });
    }
  }, [dispatch]);

  const addFavorite = (productId) => {
    console.log('addFavorite called with productId:', productId);
    dispatch(addToFavorites(productId))
      .unwrap()
      .then((res) => {
        console.log('addToFavorites success:', res);
      })
      .catch((err) => {
        console.error('addToFavorites error:', err);
      });
  };
  const removeFavorite = (productId) => dispatch(removeFromFavorites(productId));
  
  // toggleFavorite will check current state and dispatch appropriate action
  const toggleFavorite = (productId) => {
    const isFavorite = favorites.some(item => item._id === productId);
    if (isFavorite) {
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
