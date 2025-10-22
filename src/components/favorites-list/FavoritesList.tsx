/**
 * FavoritesList Component
 * Displays user's favorite movies in a grid layout
 * Allows removing movies from favorites
 */

import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { FavoriteButton } from '../favorite-button/FavoriteButton';
import './FavoritesList.scss';

/**
 * Component that displays the user's favorite movies
 * Fetches and manages favorites using the useFavorites hook
 */
export const FavoritesList: FC = () => {
  const { favorites, loading, error, isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="favorites-list">
        <div className="favorites-list__loading">
          <div className="favorites-list__spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-list">
        <div className="favorites-list__error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-list">
        <div className="favorites-list__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>No favorites yet</h3>
          <p>Start adding movies to your favorites to see them here!</p>
          <Link to="/peliculas" className="favorites-list__browse-button">
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <div className="favorites-list__header">
        <h2>My Favorites</h2>
        <span className="favorites-list__count">{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}</span>
      </div>

      <div className="favorites-list__grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="favorites-list__card">
            <Link to={`/pelicula/${movie.id}`} className="favorites-list__card-link">
              <div className="favorites-list__card-image">
                <img src={movie.portada} alt={movie.titulo} loading="lazy" />
                <div className="favorites-list__card-overlay">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>

              <div className="favorites-list__card-content">
                <h3 className="favorites-list__card-title">{movie.titulo}</h3>
                <div className="favorites-list__card-meta">
                  <span>{movie.año}</span>
                  <span>•</span>
                  <span>{movie.duracion} min</span>
                </div>
                <p className="favorites-list__card-director">{movie.director}</p>
              </div>
            </Link>

            <div className="favorites-list__card-actions">
              <FavoriteButton
                isFavorite={isFavorite(movie.id)}
                onToggle={() => toggleFavorite(movie.id)}
                size="medium"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
