/**
 * Favorites Hook
 * Custom React hook for managing movie favorites
 * Provides functions to add, remove, check, and fetch favorite movies
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getFavoriteMovies, 
  addToFavorites, 
  removeFromFavorites,
  type Movie 
} from '../services/movieService';
import authService from '../services/authService';
import { useFavoritesContext } from '../contexts/useFavoritesContext';

interface UseFavoritesReturn {
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movieId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

/**
 * Custom hook for managing user's favorite movies
 * @returns Object with favorites state and management functions
 */
export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { favoritesVersion } = useFavoritesContext();

  /**
   * Fetch user's favorite movies from the API
   */
  const refreshFavorites = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!authService.isAuthenticated()) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const movies = await getFavoriteMovies();
      setFavorites(movies);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if a movie is in favorites
   * @param movieId - ID of the movie to check
   * @returns true if movie is in favorites, false otherwise
   */
  const isFavorite = useCallback((movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

  /**
   * Toggle favorite status of a movie
   * @param movieId - ID of the movie to toggle
   */
  const toggleFavorite = useCallback(async (movieId: number) => {
    if (!authService.isAuthenticated()) {
      setError('You must be logged in to add favorites');
      return;
    }

    setError(null);

    try {
      const isCurrentlyFavorite = isFavorite(movieId);

      if (isCurrentlyFavorite) {
        // Remove from favorites
        await removeFromFavorites(movieId);
        setFavorites(prev => prev.filter(movie => movie.id !== movieId));
      } else {
        // Add to favorites
        await addToFavorites(movieId);
        // Refresh to get the updated movie data
        await refreshFavorites();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorites');
      // Refresh to ensure consistency
      await refreshFavorites();
    }
  }, [isFavorite, refreshFavorites]);

  /**
   * Load favorites on mount and when favoritesVersion changes (global trigger)
   */
  useEffect(() => {
    refreshFavorites();
  }, [favoritesVersion, refreshFavorites]);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };
};

export default useFavorites;
