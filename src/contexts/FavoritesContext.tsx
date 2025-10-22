/**
 * Favorites Context
 * Provides global state management for favorites across the application
 * Allows any component to trigger favorites refresh
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, type ReactNode } from 'react';

export interface FavoritesContextType {
  favoritesVersion: number;
  refreshFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for favorites context
 * Wrap your app with this to enable global favorites management
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  /**
   * Increment version to trigger re-fetch of favorites in all components
   * Call this after adding/removing favorites
   */
  const refreshFavorites = useCallback(() => {
    setFavoritesVersion(prev => prev + 1);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favoritesVersion, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
