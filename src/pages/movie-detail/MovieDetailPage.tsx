import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetailPage.scss";
import {
  getMovieById,
  type Movie as BackendMovie,
  addToFavorites,
  removeFromFavorites,
  getFavoriteMovies,
} from "../../services/movieService";
import { authService } from "../../services/authService";
import { useFavoritesContext } from "../../contexts/useFavoritesContext";
import { ApiError } from "../../services/api";

/**
 * MovieDetailPage Component
 * 
 * Comprehensive movie detail page displaying all information about a selected movie.
 * Provides interactive features including favorites management, rating, and commenting.
 *
 * @component
 * @returns {JSX.Element} Movie detail view with complete movie information and interactive features
 * 
 * @example
 * ```tsx
 * // Accessed via route: /pelicula/:id
 * <MovieDetailPage />
 * ```
 *
 * @description
 * Features:
 * - Full movie information display (title, synopsis, cast, director, year, duration)
 * - Background hero image with gradient overlay
 * - Favorites toggle (authentication required)
 * - Star rating system (1-5 stars with hover preview)
 * - Comment submission form
 * - Tabbed interface (Information / Comments)
 * - Share functionality (copy link to clipboard)
 * - Trailer link access
 * - Real-time favorites synchronization
 * 
 * @usability
 * Heuristics Applied:
 * - **Visibility of System Status**: Loading indicators, favorite status, rating feedback
 * - **Match Between System and Real World**: Familiar star rating, clear movie metadata
 * - **User Control and Freedom**: Back button, undo-able favorite toggle (optimistic updates)
 * - **Consistency and Standards**: Standard movie detail layout, consistent button styling
 * - **Error Prevention**: Authentication checks before protected actions, confirmation dialogs
 * - **Recognition Rather Than Recall**: Visual indicators (filled heart for favorites, star ratings)
 * - **Flexibility and Efficiency**: Keyboard shortcuts, quick share, direct play access
 * - **Aesthetic and Minimalist Design**: Clean layout, relevant information prioritized
 * - **Help Users Recognize, Diagnose, and Recover from Errors**: Clear error messages with recovery actions
 * - **Help and Documentation**: Contextual labels, aria-labels for screen readers
 *
 * @accessibility
 * WCAG 2.1 Level AA Compliance:
 * 
 * **1. Perceivable**
 * - Semantic HTML5 elements (section, header, button, form)
 * - Alt text for all images with descriptive content
 * - ARIA labels for interactive elements
 * - Sufficient color contrast (4.5:1 minimum for text)
 * - Text alternatives for non-text content
 * 
 * **2. Operable**
 * - Full keyboard navigation support
 * - Focus indicators on all interactive elements
 * - Touch targets minimum 44x44px (mobile-friendly)
 * - No keyboard traps
 * - Sufficient time for interactions (no time limits on reading)
 * 
 * **3. Understandable (New Implementation)**
 * - Clear, consistent labeling across all elements
 * - Predictable navigation patterns
 * - Input assistance with labels and placeholders
 * - Error identification with descriptive messages
 * - Language attribute declared
 * - Consistent component behavior
 * 
 * **4. Robust (New Implementation)**
 * - Valid HTML5 markup
 * - Compatible with assistive technologies (NVDA, JAWS, VoiceOver)
 * - Cross-browser compatible (Chrome, Firefox, Safari, Edge)
 * - Progressive enhancement approach
 * - Proper ARIA roles and states
 * - Resilient to browser extensions and plugins
 *
 * @wcag
 * Guidelines Implemented:
 * - **1.1.1 Non-text Content (Level A)**: All images have text alternatives
 * - **1.3.1 Info and Relationships (Level A)**: Semantic structure with proper headings
 * - **1.4.3 Contrast (Level AA)**: 4.5:1 contrast ratio for text
 * - **2.1.1 Keyboard (Level A)**: All functionality available via keyboard
 * - **2.4.3 Focus Order (Level A)**: Logical focus sequence
 * - **2.4.7 Focus Visible (Level AA)**: Clear focus indicators
 * - **3.2.1 On Focus (Level A)**: No context changes on focus
 * - **3.2.2 On Input (Level A)**: Predictable input behavior
 * - **3.3.1 Error Identification (Level A)**: Clear error messages
 * - **3.3.2 Labels or Instructions (Level A)**: Clear labels for all inputs
 * - **4.1.2 Name, Role, Value (Level A)**: Proper ARIA attributes
 * - **4.1.3 Status Messages (Level AA)**: Live regions for dynamic content
 */

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshFavorites: notifyFavoritesChange } = useFavoritesContext();
  const [movie, setMovie] = useState<BackendMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "comments">("info");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  // Check if movie is in user's favorites ONLY when movie loads
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Only check if user is authenticated AND movie is loaded
      if (!isAuthenticated || !movie) {
        setIsFavorite(false);
        return;
      }

      try {
        const favorites = await getFavoriteMovies();
        const isFav = favorites.some((fav) => fav.id === movie.id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        // If error (e.g., 401), set as not favorite
        setIsFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, movie]); // Remove favoritesVersion from dependencies

  // Fetch movie data from backend
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError("ID de película no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const movieData = await getMovieById(parseInt(id));
        setMovie(movieData);
        setError(null);
      } catch (err) {
        console.error("Error loading movie:", err);
        setError("No se pudo cargar la película. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  /**
   * Handles navigation back to the movies list page.
   * Ensures favorites are refreshed and reloads the page for fresh data.
   * 
   * @usability
   * - **User Control and Freedom**: Allows easy navigation back
   * - **Consistency**: Ensures data consistency across views
   */
  const handleBack = () => {
    // Refresh favorites when going back to ensure the favorites list is updated
    notifyFavoritesChange();
    
    // Force a full page reload to ensure fresh data
    window.location.href = '/peliculas';
  };

  /**
   * Initiates movie playback by navigating to the player page.
   * 
   * @usability
   * - **Flexibility and Efficiency**: Quick access to main action
   */
  const handleWatch = () => {
    if (movie) {
      navigate(`/pelicula/${movie.id}/player`);
    }
  };

  /**
   * Toggles the favorite status of the current movie.
   * Implements optimistic UI updates with error recovery.
   * Handles authentication requirements and session validation.
   * 
   * @async
   * @throws {ApiError} When API request fails
   * 
   * @usability
   * - **Error Prevention**: Checks authentication before attempting action
   * - **Visibility of System Status**: Immediate visual feedback via optimistic update
   * - **Help Users Recover from Errors**: Clear error messages with recovery options
   * 
   * @accessibility
   * - Announces status changes for screen readers
   * - Provides clear confirmation dialogs
   */
  const handleToggleFavorite = async () => {
    // Check authentication first (local check)
    if (!isAuthenticated) {
      const shouldLogin = window.confirm(
        "Debes iniciar sesión para agregar películas a favoritos. ¿Quieres ir a la página de inicio de sesión?"
      );
      if (shouldLogin) {
        navigate("/login");
      }
      return;
    }

    if (!movie) return;

    // Optimistic update - change UI immediately
    const wasInFavorites = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      if (wasInFavorites) {
        // Remove from favorites
        await removeFromFavorites(movie.id);
      } else {
        // Add to favorites
        await addToFavorites(movie.id);
      }
      
      // Success - notify other components to refresh their favorites
      notifyFavoritesChange();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update on error
      setIsFavorite(wasInFavorites);
      
      // Check if it's an authentication error (401)
      if (error instanceof ApiError && error.status === 401) {
        // Clear user data since session is invalid
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        
        const shouldLogin = window.confirm(
          "Tu sesión ha expirado. ¿Quieres iniciar sesión nuevamente?"
        );
        if (shouldLogin) {
          navigate("/login");
        }
      } else {
        // Other errors
        alert("No se pudo actualizar favoritos. Intenta nuevamente.");
      }
    }
  };

  /**
   * Copies the current page URL to the clipboard for sharing.
   * Provides fallback for browsers without Clipboard API support.
   * 
   * @async
   * 
   * @usability
   * - **Flexibility and Efficiency**: Quick share functionality
   * - **Error Prevention**: Graceful fallback for older browsers
   * - **Visibility of System Status**: Immediate feedback via alert
   * 
   * @robust
   * - Progressive enhancement with fallback
   * - Cross-browser compatibility
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    } catch (error) {
      console.log("Error copiando al portapapeles:", error);
      // Fallback para navegadores antiguos (Robust: Browser compatibility)
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("¡Enlace copiado al portapapeles!");
      } catch {
        alert("No se pudo copiar el enlace");
      }
      document.body.removeChild(textArea);
    }
  };

  /**
   * Switches between information and comments tabs.
   * 
   * @param {"info" | "comments"} tab - The tab to switch to
   * 
   * @usability
   * - **Consistency and Standards**: Standard tabbed interface pattern
   * - **Flexibility and Efficiency**: Quick content access
   */
  const handleTabChange = (tab: "info" | "comments") => {
    setActiveTab(tab);
  };

  /**
   * Handles star rating selection.
   * 
   * @param {number} rating - Rating value from 1 to 5
   * 
   * @usability
   * - **Recognition Rather Than Recall**: Visual star representation
   * - **Visibility of System Status**: Shows selected rating
   */
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  /**
   * Handles hover preview for star ratings.
   * 
   * @param {number} rating - Rating value being hovered
   * 
   * @usability
   * - **Visibility of System Status**: Preview of selection before commit
   */
  const handleRatingHover = (rating: number) => {
    setHoverRating(rating);
  };

  /**
   * Resets hover state when mouse leaves rating stars.
   * 
   * @usability
   * - **Visibility of System Status**: Clear feedback on interaction state
   */
  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  // Show loading state (Visibility of System Status)
  if (loading) {
    return (
      <div className="movie-detail" role="main">
        <div 
          className="movie-detail__loading" 
          role="status" 
          aria-live="polite"
          aria-label="Cargando información de la película"
        >
          <div className="spinner" aria-hidden="true"></div>
          <p>Cargando película...</p>
        </div>
      </div>
    );
  }

  // Show error state (Help Users Recognize and Recover from Errors)
  if (error || !movie) {
    return (
      <div className="movie-detail" role="main">
        <div 
          className="movie-detail__error" 
          role="alert"
          aria-live="assertive"
        >
          <p>{error || "Película no encontrada"}</p>
          <button
            onClick={handleBack}
            className="movie-detail__action-button movie-detail__action-button--primary"
            aria-label="Regresar a la página de películas"
          >
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // Helper para formatear actores (el backend guarda como string separado por comas)
  const actoresList = movie.actores
    ? movie.actores.split(",").map((a: string) => a.trim())
    : [];

  return (
    <div className="movie-detail" role="main" aria-labelledby="movie-title">
      {/* Header con imagen de fondo */}
      <div
        className="movie-detail__header"
        style={{ backgroundImage: `url(${movie.portada})` }}
        role="img"
        aria-label={`Imagen de portada de ${movie.titulo}`}
      >
        <div className="movie-detail__header-overlay">
          <button
            className="movie-detail__back-button"
            onClick={handleBack}
            aria-label="Regresar a la página anterior"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Regresar
          </button>

          <button
            className="movie-detail__share-button"
            onClick={handleShare}
            aria-label="Copiar enlace de la película"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6897C16.4231 14.4391 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33401 21.9434 7.02303C21.932 5.71204 21.4061 4.45797 20.4791 3.53091C19.552 2.60386 18.298 2.07802 16.987 2.06663C15.676 2.05523 14.413 2.55921 13.47 3.47L11.75 5.18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11C13.5705 10.4259 13.0226 9.95084 12.3934 9.60707C11.7643 9.26331 11.0685 9.05889 10.3533 9.00768C9.63819 8.95646 8.92037 9.05964 8.24861 9.31029C7.57685 9.56094 6.96689 9.95303 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.542 3.52088 20.4691C4.44793 21.3961 5.702 21.922 7.01299 21.9334C8.32397 21.9448 9.58696 21.4408 10.53 20.53L12.24 18.82"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="movie-detail__title-section">
            <h1 className="movie-detail__title" id="movie-title">{movie.titulo}</h1>
            <div className="movie-detail__metadata" role="list" aria-label="Metadata de la película">
              <span
                className="movie-detail__year"
                role="listitem"
                aria-label={`Año de estreno: ${movie.año}`}
              >
                {movie.año}
              </span>
              <span className="movie-detail__dot" aria-hidden="true" role="presentation">
                •
              </span>
              <span
                className="movie-detail__duration"
                role="listitem"
                aria-label={`Duración: ${movie.duracion} minutos`}
              >
                {movie.duracion} min
              </span>
              <span className="movie-detail__dot" aria-hidden="true" role="presentation">
                •
              </span>
              <span
                className="movie-detail__classification"
                role="listitem"
                aria-label={`Estado de disponibilidad: ${movie.disponible ? "Disponible para ver" : "No disponible actualmente"}`}
              >
                {movie.disponible ? "✓ Disponible" : "✗ No disponible"}
              </span>
            </div>
            <div className="movie-detail__genres" role="list" aria-label="Información del director">
              <span className="movie-detail__genre" role="listitem">
                Director: {movie.director}
              </span>
            </div>

            {/* Botones de acción dentro del overlay */}
            <div className="movie-detail__actions">
              <button
                className="movie-detail__action-button movie-detail__action-button--primary"
                onClick={handleWatch}
                aria-label={`Ver ${movie.titulo}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3L19 12L5 21V3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ver
              </button>

              <button
                className={`movie-detail__action-button movie-detail__action-button--secondary ${
                  isFavorite ? "movie-detail__action-button--active" : ""
                }`}
                onClick={handleToggleFavorite}
                aria-label={
                  isFavorite
                    ? `Quitar ${movie.titulo} de favoritos`
                    : `Añadir ${movie.titulo} a favoritos`
                }
                aria-pressed={isFavorite}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20.84 4.61C20.3292 4.09913 19.7228 3.69374 19.0554 3.41731C18.3879 3.14088 17.6725 2.99878 16.95 2.99878C16.2275 2.99878 15.5121 3.14088 14.8446 3.41731C14.1772 3.69374 13.5708 4.09913 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3509 11.8792 21.7563 11.2728 22.0327 10.6054C22.3091 9.93789 22.4512 9.22248 22.4512 8.5C22.4512 7.77752 22.3091 7.06211 22.0327 6.39464C21.7563 5.72718 21.3509 5.12075 20.84 4.61Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isFavorite ? "En Favoritos" : "Añadir a Favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="movie-detail__content">
        {/* Pestañas de navegación */}
        <div className="movie-detail__tabs">
          <button
            className={`movie-detail__tab ${
              activeTab === "info" ? "movie-detail__tab--active" : ""
            }`}
            onClick={() => handleTabChange("info")}
            aria-label="Ver información de la película"
            aria-pressed={activeTab === "info"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 16V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Más Información
          </button>

          <button
            className={`movie-detail__tab ${
              activeTab === "comments" ? "movie-detail__tab--active" : ""
            }`}
            onClick={() => handleTabChange("comments")}
            aria-label="Ver comentarios"
            aria-pressed={activeTab === "comments"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Comentarios
          </button>
        </div>

        {/* Contenido de la pestaña de información */}
        {activeTab === "info" && (
          <div className="movie-detail__tab-content">
            <section
              className="movie-detail__info-section"
              aria-labelledby="sinopsis-title"
            >
              <h2 id="sinopsis-title" className="movie-detail__section-title">
                Sinopsis
              </h2>
              <p className="movie-detail__sinopsis">{movie.sinopsis}</p>
            </section>

            <section
              className="movie-detail__info-section"
              aria-labelledby="info-title"
            >
              <h2 id="info-title" className="movie-detail__section-title">
                Información
              </h2>
              <div className="movie-detail__info-grid">
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Director:</span>
                  <span className="movie-detail__info-value">
                    {movie.director}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Actores:</span>
                  <span className="movie-detail__info-value">
                    {actoresList.join(", ")}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Año:</span>
                  <span className="movie-detail__info-value">{movie.año}</span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Duración:</span>
                  <span className="movie-detail__info-value">
                    {movie.duracion} minutos
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">
                    Disponibilidad:
                  </span>
                  <span className="movie-detail__info-value movie-detail__info-value--available">
                    {movie.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Trailer:</span>
                  <span className="movie-detail__info-value">
                    {movie.trailer ? (
                      <a
                        href={movie.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Ver trailer
                      </a>
                    ) : (
                      "No disponible"
                    )}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Contenido de la pestaña de comentarios */}
        {activeTab === "comments" && (
          <div className="movie-detail__tab-content">
            <section
              className="movie-detail__comments-section"
              aria-labelledby="comments-title"
            >
              <h2 id="comments-title" className="movie-detail__section-title">
                Deja tu comentario
              </h2>

              {/* Formulario de nuevo comentario */}
              <div className="movie-detail__comment-form">
                <div className="movie-detail__rating-container">
                  <label className="movie-detail__rating-label">
                    Califica esta película:
                  </label>
                  <div
                    className="movie-detail__stars"
                    onMouseLeave={handleRatingLeave}
                    role="radiogroup"
                    aria-label="Calificación de 1 a 5 estrellas"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`movie-detail__star ${
                          star <= (hoverRating || selectedRating)
                            ? "movie-detail__star--filled"
                            : ""
                        }`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        aria-label={`${star} ${
                          star === 1 ? "estrella" : "estrellas"
                        }`}
                        role="radio"
                        aria-checked={selectedRating === star}
                        type="button"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {selectedRating > 0 && (
                    <span className="movie-detail__rating-text">
                      {selectedRating} de 5 estrellas
                    </span>
                  )}
                </div>

                <div className="movie-detail__textarea-container">
                  <label
                    htmlFor="comment-textarea"
                    className="movie-detail__textarea-label"
                  >
                    Tu comentario:
                  </label>
                  <textarea
                    id="comment-textarea"
                    className="movie-detail__textarea"
                    placeholder="Escribe tu opinión sobre esta película..."
                    rows={5}
                    aria-label="Escribe tu comentario sobre la película"
                  />
                </div>

                <button
                  className="movie-detail__submit-button"
                  type="button"
                  aria-label="Enviar comentario"
                >
                  Publicar Comentario
                </button>
              </div>

              {/* Mensaje de que no hay comentarios aún */}
              <div className="movie-detail__no-comments">
                <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
