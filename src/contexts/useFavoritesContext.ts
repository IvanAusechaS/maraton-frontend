/**
 * useFavoritesContext Hook
 * Custom hook to access the Favorites Context
 */

import { useContext } from 'react';
import { FavoritesContext, type FavoritesContextType } from './FavoritesContext';

/**
 * Custom hook to access favorites context
 * @throws Error if used outside of FavoritesProvider
 * @returns FavoritesContextType with favoritesVersion and refreshFavorites function
 */
export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return context;
};
