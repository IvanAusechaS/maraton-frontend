import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviePage.scss";
import {
  getMoviesByGenre,
  getFavoriteMovies,
  getWatchLaterMovies,
  type Movie,
} from "../../services/movieService";
import { authService } from "../../services/authService";

interface MovieCategory {
  title: string;
  movies: Movie[];
  loading: boolean;
  visible: boolean; // Para controlar visibilidad de Favoritos y Ver más tarde
}

const MoviePage: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<{
    [key: string]: MovieCategory;
  }>({
    favorites: {
      title: "Favoritos",
      movies: [],
      loading: true,
      visible: false,
    },
    watchLater: {
      title: "Ver más tarde",
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Si el usuario está autenticado, cargar favoritos y ver más tarde
        if (isAuthenticated) {
          // Favoritos - SIEMPRE VISIBLE cuando está autenticado
          try {
            const favoritesData = await getFavoriteMovies();
            setCategories((prev) => ({
              ...prev,
              favorites: {
                ...prev.favorites,
                movies: favoritesData,
                loading: false,
                visible: true, // Siempre visible si está autenticado
              },
            }));
          } catch {
            // Si falla, mostrar vacío pero MANTENER VISIBLE
            setCategories((prev) => ({
              ...prev,
              favorites: {
                ...prev.favorites,
                movies: [],
                loading: false,
                visible: true, // MANTENER VISIBLE aunque haya error
              },
            }));
          }

          // Ver más tarde - SIEMPRE VISIBLE cuando está autenticado
          try {
            const watchLaterData = await getWatchLaterMovies();
            setCategories((prev) => ({
              ...prev,
              watchLater: {
                ...prev.watchLater,
                movies: watchLaterData,
                loading: false,
                visible: true, // Siempre visible si está autenticado
              },
            }));
          } catch {
            // Si falla, mostrar vacío pero MANTENER VISIBLE
            setCategories((prev) => ({
              ...prev,
              watchLater: {
                ...prev.watchLater,
                movies: [],
                loading: false,
                visible: true, // MANTENER VISIBLE aunque haya error
              },
            }));
          }
        } else {
          // Si no está autenticado, ocultar estas categorías inmediatamente
          setCategories((prev) => ({
            ...prev,
            favorites: {
              ...prev.favorites,
              movies: [],
              loading: false,
              visible: false,
            },
            watchLater: {
              ...prev.watchLater,
              movies: [],
              loading: false,
              visible: false,
            },
          }));
        }

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
  }, [isAuthenticated]);

  return (
    <div className="movie-page">
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

interface MovieRowProps {
  title: string;
  movies: Movie[];
  loading: boolean;
}

const MovieRow: FC<MovieRowProps> = ({ title, movies, loading }) => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

    // Update arrow visibility
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
      <div className="video-row">
        <h2 className="video-row__title">{title}</h2>
        <div className="video-row__loading">Cargando películas...</div>
      </div>
    );
  }

  // Si no hay películas, mostrar mensaje apropiado
  if (movies.length === 0) {
    return (
      <div className="video-row">
        <h2 className="video-row__title">{title}</h2>
        <div className="video-row__empty">
          {title === "Favoritos" || title === "Ver más tarde"
            ? `No tienes películas en ${title.toLowerCase()}`
            : "Temporalmente no disponible. Intenta más tarde."}
        </div>
      </div>
    );
  }

  return (
    <div className="video-row">
      <h2 className="video-row__title">{title}</h2>
      <div className="video-row__wrapper">
        {canScrollLeft && (
          <button
            className="video-row__arrow video-row__arrow--left"
            onClick={() => handleScroll("left")}
          >
            <img src="/arrow-white.svg" alt="Previous" />
          </button>
        )}

        <div className="video-row__container" id={`movie-row-${title}`}>
          {movies.map((movie) => {
            return (
              <div
                key={movie.id}
                className="video-card"
                onClick={() => navigate(`/pelicula/${movie.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/pelicula/${movie.id}`);
                  }
                }}
                aria-label={`Ver detalles de ${movie.titulo}`}
              >
                <div className="video-card__image">
                  <img
                    src={movie.portada}
                    alt={movie.titulo}
                    onError={(e) => {
                      // Fallback image if portada fails to load
                      (e.target as HTMLImageElement).src =
                        "/placeholder-movie.jpg";
                    }}
                  />
                  <div className="video-card__overlay">
                    <button
                      className="video-card__play"
                      aria-label={`Reproducir ${movie.titulo}`}
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className="video-card__info">
                  <h3 className="video-card__title">{movie.titulo}</h3>
                  <span className="video-card__duration">
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
          >
            <img src="/arrow-white.svg" alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
