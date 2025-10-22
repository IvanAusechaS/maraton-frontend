/**
 * useFavoritesContext Hook Module
 *
 * Provides type-safe access to the FavoritesContext.
 * Enforces proper context usage with runtime validation.
 *
 * @module contexts/useFavoritesContext
 *
 * @description
 * This custom hook simplifies access to the FavoritesContext and ensures
 * it's only used within a FavoritesProvider. Throws a descriptive error
 * if misused, helping developers catch configuration issues early.
 *
 * @usability
 * - **Error Prevention**: Validates context availability at runtime
 * - **Consistency**: Provides uniform access pattern across components
 * - **Help and Documentation**: Clear error messages guide proper usage
 *
 * @robust
 * - Type-safe return value (TypeScript)
 * - Runtime validation prevents silent failures
 * - Descriptive error messages for debugging
 *
 * @example
 * ```tsx
 * // Correct usage within FavoritesProvider
 * const MyComponent = () => {
 *   const { favoritesVersion, refreshFavorites } = useFavoritesContext();
 *
 *   useEffect(() => {
 *     fetchFavorites();
 *   }, [favoritesVersion]);
 *
 *   const handleAddFavorite = async () => {
 *     await addToFavorites(movieId);
 *     refreshFavorites();
 *   };
 *
 *   return <div>...</div>;
 * };
 *
 * // Incorrect usage (will throw error)
 * const BadComponent = () => {
 *   const context = useFavoritesContext(); // Error: not wrapped in Provider
 *   return <div>...</div>;
 * };
 * ```
 */

import { useContext } from "react";
import {
  FavoritesContext,
  type FavoritesContextType,
} from "./FavoritesContext";

/**
 * Custom hook for accessing the FavoritesContext.
 *
 * @hook
 * @returns {FavoritesContextType} Context value containing favoritesVersion and refreshFavorites
 * @throws {Error} If used outside of FavoritesProvider
 *
 * @description
 * Provides type-safe access to:
 * - `favoritesVersion`: Number that increments when favorites change
 * - `refreshFavorites`: Function to notify all subscribers of favorites update
 *
 * Must be called within a component that's a descendant of FavoritesProvider.
 *
 * @usability
 * - **Error Prevention**: Immediate feedback if provider missing
 * - **Consistency**: Standard access pattern across all components
 * - **Help Users Recover from Errors**: Clear error message explains solution
 *
 * @example
 * ```tsx
 * function MovieDetailPage() {
 *   const { favoritesVersion, refreshFavorites } = useFavoritesContext();
 *
 *   // Subscribe to favorites changes
 *   useEffect(() => {
 *     console.log('Favorites updated, version:', favoritesVersion);
 *     loadFavoritesStatus();
 *   }, [favoritesVersion]);
 *
 *   // Notify of favorites change
 *   const toggleFavorite = async () => {
 *     await updateFavorite();
 *     refreshFavorites(); // Triggers re-fetch in all components
 *   };
 * }
 * ```
 */
export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider. " +
        "Wrap your component tree with <FavoritesProvider> to use this hook."
    );
  }

  return context;
};
