/**
 * FavoritesContext Module
 * 
 * Provides global state management for user favorites across the application.
 * Implements a version-based update pattern for efficient change propagation.
 * 
 * @module contexts/FavoritesContext
 * 
 * @description
 * Features:
 * - Global favorites state management
 * - Version-based change tracking
 * - Callback-based refresh mechanism
 * - TypeScript type safety
 * - React Context API integration
 * 
 * Usage Pattern:
 * 1. Wrap app with FavoritesProvider
 * 2. Use useFavoritesContext hook in components
 * 3. Call refreshFavorites() after mutations
 * 4. Listen to favoritesVersion changes in useEffect
 * 
 * @usability
 * - **Consistency**: Single source of truth for favorites state
 * - **Flexibility**: Components can subscribe to changes as needed
 * - **Efficiency**: Version increment prevents unnecessary re-renders
 * 
 * @example
 * ```tsx
 * // In root App component
 * <FavoritesProvider>
 *   <YourApp />
 * </FavoritesProvider>
 * 
 * // In any component
 * const { favoritesVersion, refreshFavorites } = useFavoritesContext();
 * 
 * useEffect(() => {
 *   // Reload favorites when version changes
 *   loadFavorites();
 * }, [favoritesVersion]);
 * 
 * // After adding/removing favorite
 * await addToFavorites(movieId);
 * refreshFavorites(); // Notify all subscribers
 * ```
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, type ReactNode } from 'react';

/**
 * Type definition for the FavoritesContext value.
 * 
 * @interface FavoritesContextType
 * @property {number} favoritesVersion - Incremental version number for tracking changes
 * @property {() => void} refreshFavorites - Function to trigger favorites refresh across app
 */
export interface FavoritesContextType {
  favoritesVersion: number;
  refreshFavorites: () => void;
}

/**
 * React Context for favorites state management.
 * Provides favoritesVersion and refreshFavorites to all consuming components.
 * 
 * @type {React.Context<FavoritesContextType | undefined>}
 */
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * Props for FavoritesProvider component.
 * 
 * @interface FavoritesProviderProps
 * @property {ReactNode} children - Child components to be wrapped
 */
interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * FavoritesProvider Component
 * 
 * Context provider that manages global favorites state.
 * Should wrap the entire application or the portion that needs favorites management.
 * 
 * @component
 * @param {FavoritesProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with children
 * 
 * @description
 * Manages a version counter that increments each time favorites are modified.
 * Components can subscribe to version changes to re-fetch their data.
 * This pattern avoids passing callbacks through multiple component layers.
 * 
 * @usability
 * - **Consistency**: Ensures all components see the same favorites state
 * - **Error Prevention**: Automatic synchronization prevents stale data
 * - **Flexibility**: Components can choose when to subscribe to updates
 * 
 * @example
 * ```tsx
 * // Wrap root component
 * root.render(
 *   <FavoritesProvider>
 *     <RouterProvider router={router} />
 *   </FavoritesProvider>
 * );
 * ```
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  /**
   * Version counter for tracking favorites changes.
   * Increments on each refresh, triggering dependent effects.
   * 
   * @type {number}
   */
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  /**
   * Increments the favorites version to notify all subscribers.
   * Call this function after any operation that modifies favorites.
   * 
   * @function refreshFavorites
   * @returns {void}
   * 
   * @description
   * This triggers a re-render in all components that depend on favoritesVersion.
   * Uses useCallback to maintain referential equality across renders.
   * 
   * @example
   * ```tsx
   * await addToFavorites(movieId);
   * refreshFavorites(); // Notify all components
   * ```
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
