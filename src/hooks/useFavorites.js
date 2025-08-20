import { useSelector, useDispatch } from 'react-redux';
import { 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite as toggleFavoriteAction, 
  selectFavorites, 
  selectFavoritesCount
} from '../store/favoritesSlice';

export const useFavorites = () => {
  const dispatch = useDispatch();
  
  const favorites = useSelector(selectFavorites);
  const favoritesCount = useSelector(selectFavoritesCount);
  
  const addFavorite = (product) => dispatch(addToFavorites(product));
  const removeFavorite = (productId) => dispatch(removeFromFavorites(productId));
  const toggleFavorite = (product) => dispatch(toggleFavoriteAction(product));
  
  // Create a simple function to check if item is favorite
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  return {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
