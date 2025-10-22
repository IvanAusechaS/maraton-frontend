/**
 * FavoriteButton Component
 * Interactive button to add/remove movies from favorites
 * Shows heart icon that changes based on favorite status
 */

import { type FC } from 'react';
import './FavoriteButton.scss';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

/**
 * Button component for toggling favorite status of a movie
 * @param props - Component props
 * @param props.isFavorite - Whether the movie is currently a favorite
 * @param props.onToggle - Callback function when button is clicked
 * @param props.disabled - Whether the button is disabled
 * @param props.size - Size variant of the button
 * @param props.showLabel - Whether to show text label
 */
export const FavoriteButton: FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onToggle, 
  disabled = false,
  size = 'medium',
  showLabel = false
}) => {
  return (
    <button 
      className={`favorite-button favorite-button--${size} ${isFavorite ? 'favorite-button--active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className="favorite-button__icon" 
        viewBox="0 0 24 24" 
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showLabel && (
        <span className="favorite-button__label">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
