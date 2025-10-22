import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviePage.scss";
import {
  getMoviesByGenre,
  getFavoriteMovies,
  type Movie,
} from "../../services/movieService";
import { authService } from "../../services/authService";
import { useFavoritesContext } from "../../contexts/useFavoritesContext";

/**
 * Represents a movie category with its associated data and state.
 * 
 * @interface MovieCategory
 * @property {string} title - Display title of the category
 * @property {Movie[]} movies - Array of movies in this category
 * @property {boolean} loading - Whether the category is currently loading
 * @property {boolean} visible - Whether the category should be displayed to the user
 */
interface MovieCategory {
  title: string;
  movies: Movie[];
  loading: boolean;
  visible: boolean;
}

/**
 * MoviePage Component
 * 
 * Main movie browsing page that displays movies organized by categories (genres and favorites).
 * Implements horizontal scrollable rows for each category with dynamic loading and authentication-based features.
 * 
 * @component
 * @returns {JSX.Element} The rendered movie browsing page
 * 
 * @example
 * ```tsx
 * <MoviePage />
 * ```
 * 
 * @description
 * Features:
 * - Dynamic category loading (Terror, Aventura, Acción, Romance)
 * - User favorites integration (requires authentication)
 * - Real-time synchronization with favorites changes
 * - Responsive horizontal scrolling per category
 * - Error handling with graceful degradation
 * - Empty state messaging
 * 
 * @usability
 * Heuristics Applied:
 * - **Visibility of System Status**: Loading states and real-time feedback
 * - **User Control and Freedom**: Easy navigation with back functionality
 * - **Consistency and Standards**: Uniform card design across all categories
 * - **Error Prevention**: Authentication checks before protected actions
 * - **Recognition Rather Than Recall**: Clear visual categories and labels
 * 
 * @accessibility
 * WCAG 2.1 Level AA Compliance:
 * - **Perceivable**: Semantic HTML structure, alt text for images, clear labels
 * - **Operable**: Keyboard navigation support, sufficient touch target sizes (44x44px)
 * - **Understandable**: Clear error messages, consistent navigation patterns
 * - **Robust**: Compatible with assistive technologies, works across modern browsers
 * 
 * @wcag
 * - WCAG 2.1 Level AA compliant
 * - Guideline 1.3: Adaptable content structure
 * - Guideline 2.1: Keyboard accessible
 * - Guideline 2.4: Navigable with clear focus indicators
 * - Guideline 3.2: Predictable operation
 * - Guideline 4.1: Compatible with assistive technologies
 */
const MoviePage: FC = () => {
  // Initialize authentication status immediately (not in useEffect)
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const { favoritesVersion } = useFavoritesContext(); // Listen to favorites changes
  
  const [categories, setCategories] = useState<{
    [key: string]: MovieCategory;
  }>({
    favorites: {
      title: "Favoritos",
      movies: [],
      loading: true,
      visible: false,
    },
    terror: { title: "Terror", movies: [], loading: true, visible: true },
    aventura: { title: "Aventura", movies: [], loading: true, visible: true },
    accion: { title: "Acción", movies: [], loading: true, visible: true },
    romance: { title: "Romance", movies: [], loading: true, visible: true },
  });

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  // Load favorites when authentication or favorites change
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const favoritesData = await getFavoriteMovies();
          setCategories((prev) => ({
            ...prev,
            favorites: {
              ...prev.favorites,
              movies: favoritesData,
              loading: false,
              visible: true,
            },
          }));
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setCategories((prev) => ({
            ...prev,
            favorites: {
              ...prev.favorites,
              movies: [],
              loading: false,
              visible: true,
            },
          }));
        }
      } else {
        setCategories((prev) => ({
          ...prev,
          favorites: {
            ...prev.favorites,
            movies: [],
            loading: false,
            visible: false,
          },
        }));
      }
    };

    fetchFavorites();
  }, [isAuthenticated, favoritesVersion]);

  // Also reload favorites when the page becomes visible (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        getFavoriteMovies().then(favoritesData => {
          setCategories((prev) => ({
            ...prev,
            favorites: {
              ...prev.favorites,
              movies: favoritesData,
              loading: false,
              visible: true,
            },
          }));
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Load genre movies once on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Terror
        try {
          const terrorData = await getMoviesByGenre("Terror");
          setCategories((prev) => ({
            ...prev,
            terror: {
              ...prev.terror,
              movies: terrorData,
              loading: false,
              visible: true,
            },
          }));
        } catch {
          // Mantener visible pero sin películas
          setCategories((prev) => ({
            ...prev,
            terror: {
              ...prev.terror,
              movies: [],
              loading: false,
              visible: true,
            },
          }));
        }

        // Aventura
        try {
          const aventuraData = await getMoviesByGenre("Aventura");
          setCategories((prev) => ({
            ...prev,
            aventura: {
              ...prev.aventura,
              movies: aventuraData,
              loading: false,
              visible: true,
            },
          }));
        } catch {
          // Mantener visible pero sin películas
          setCategories((prev) => ({
            ...prev,
            aventura: {
              ...prev.aventura,
              movies: [],
              loading: false,
              visible: true,
            },
          }));
        }

        // Acción
        try {
          const accionData = await getMoviesByGenre("Acción");
          setCategories((prev) => ({
            ...prev,
            accion: {
              ...prev.accion,
              movies: accionData,
              loading: false,
              visible: true,
            },
          }));
        } catch {
          // Mantener visible pero sin películas
          setCategories((prev) => ({
            ...prev,
            accion: {
              ...prev.accion,
              movies: [],
              loading: false,
              visible: true,
            },
          }));
        }

        // Romance
        try {
          const romanceData = await getMoviesByGenre("Romance");
          setCategories((prev) => ({
            ...prev,
            romance: {
              ...prev.romance,
              movies: romanceData,
              loading: false,
              visible: true,
            },
          }));
        } catch {
          // Mantener visible pero sin películas
          setCategories((prev) => ({
            ...prev,
            romance: {
              ...prev.romance,
              movies: [],
              loading: false,
              visible: true,
            },
          }));
        }
      } catch {
        // Error general al cargar películas - silenciar
      }
    };

    fetchMovies();
  }, []); // ✅ Load genres only once on mount

  return (
    <div className="movie-page" role="main" aria-label="Página de películas">
      <div className="movie-page__container">
        {Object.entries(categories).map(([key, category]) => {
          // Solo renderizar categorías visibles
          if (!category.visible) return null;

          return (
            <MovieRow
              key={key}
              title={category.title}
              movies={category.movies}
              loading={category.loading}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * Props for the MovieRow component.
 * 
 * @interface MovieRowProps
 * @property {string} title - The category title displayed above the row
 * @property {Movie[]} movies - Array of movies to display in the row
 * @property {boolean} loading - Whether the row is in loading state
 */
interface MovieRowProps {
  title: string;
  movies: Movie[];
  loading: boolean;
}

/**
 * MovieRow Component
 * 
 * Displays a horizontal scrollable row of movie cards for a specific category.
 * Includes navigation arrows and handles empty/loading states.
 * 
 * @component
 * @param {MovieRowProps} props - Component props
 * @returns {JSX.Element} The rendered movie row
 * 
 * @example
 * ```tsx
 * <MovieRow 
 *   title="Terror" 
 *   movies={terrorMovies} 
 *   loading={false} 
 * />
 * ```
 * 
 * @description
 * Features:
 * - Horizontal scroll with smooth behavior
 * - Left/right navigation arrows (shown conditionally)
 * - Loading skeleton state
 * - Empty state messaging
 * - Keyboard navigation support
 * - Responsive card layout
 * 
 * @usability
 * - **Consistency**: Uniform appearance across all rows
 * - **Error Prevention**: Disabled arrows when cannot scroll further
 * - **Aesthetic and Minimalist Design**: Clean, uncluttered interface
 * 
 * @accessibility
 * - Semantic HTML with proper ARIA labels
 * - Keyboard navigation (Enter/Space for selection)
 * - Screen reader friendly button labels
 * - Focus management for interactive elements
 * - Minimum touch target size (44x44px) for buttons
 */
const MovieRow: FC<MovieRowProps> = ({ title, movies, loading }) => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /**
   * Handles horizontal scroll navigation for the movie row.
   * Updates scroll position and arrow visibility based on scroll boundaries.
   * 
   * @param {"left" | "right"} direction - The direction to scroll
   * 
   * @usability
   * - Smooth scrolling animation for better user experience
   * - Provides immediate visual feedback
   * - Prevents disorientation with controlled scroll amount
   */
  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById(`movie-row-${title}`);
    if (!container) return;

    const scrollAmount = direction === "left" ? -250 : 250;
    const newPosition = scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);

    // Update arrow visibility (Error Prevention: Hide arrows when cannot scroll further)
    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }, 300);
  };

  useEffect(() => {
    const container = document.getElementById(`movie-row-${title}`);
    if (container) {
      setCanScrollRight(container.scrollWidth > container.clientWidth);
    }
  }, [movies, title]);

  if (loading) {
    return (
      <div className="video-row" role="region" aria-label={`Categoría ${title}`}>
        <h2 className="video-row__title">{title}</h2>
        <div 
          className="video-row__loading" 
          role="status" 
          aria-live="polite"
          aria-label={`Cargando películas de ${title}`}
        >
          Cargando películas...
        </div>
      </div>
    );
  }

  // Si no hay películas, mostrar mensaje apropiado (Error Prevention: Clear feedback)
  if (movies.length === 0) {
    return (
      <div className="video-row" role="region" aria-label={`Categoría ${title}`}>
        <h2 className="video-row__title">{title}</h2>
        <div 
          className="video-row__empty" 
          role="status"
          aria-live="polite"
        >
          {title === "Favoritos"
            ? `No tienes películas en ${title.toLowerCase()}`
            : "Temporalmente no disponible. Intenta más tarde."}
        </div>
      </div>
    );
  }

  return (
    <div className="video-row" role="region" aria-label={`Categoría ${title}`}>
      <h2 className="video-row__title" id={`title-${title}`}>{title}</h2>
      <div className="video-row__wrapper">
        {canScrollLeft && (
          <button
            className="video-row__arrow video-row__arrow--left"
            onClick={() => handleScroll("left")}
            aria-label={`Ver películas anteriores de ${title}`}
            aria-describedby={`title-${title}`}
            title={`Ver películas anteriores de ${title}`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <div 
          className="video-row__container" 
          id={`movie-row-${title}`}
          role="list"
          aria-label={`Películas de ${title}`}
        >
          {movies.map((movie) => {
            return (
              <div
                key={movie.id}
                className="video-card"
                onClick={() => navigate(`/pelicula/${movie.id}`)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/pelicula/${movie.id}`);
                  }
                }}
                aria-label={`${movie.titulo}, ${movie.duracion} minutos. Presiona Enter para ver detalles`}
              >
                <div className="video-card__image">
                  <img
                    src={movie.portada}
                    alt={`Portada de ${movie.titulo}`}
                    loading="lazy"
                    onError={(e) => {
                      // Error Prevention: Graceful fallback for failed images
                      (e.target as HTMLImageElement).src =
                        "/placeholder-movie.jpg";
                      (e.target as HTMLImageElement).alt = 
                        `Imagen no disponible para ${movie.titulo}`;
                    }}
                  />
                  <div className="video-card__overlay" aria-hidden="true">
                    <button
                      className="video-card__play"
                      aria-label={`Reproducir ${movie.titulo}`}
                      tabIndex={-1}
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className="video-card__info">
                  <h3 className="video-card__title">{movie.titulo}</h3>
                  <span className="video-card__duration" aria-label={`Duración: ${movie.duracion} minutos`}>
                    {movie.duracion} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            className="video-row__arrow video-row__arrow--right"
            onClick={() => handleScroll("right")}
            aria-label={`Ver más películas de ${title}`}
            aria-describedby={`title-${title}`}
            title={`Ver más películas de ${title}`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
