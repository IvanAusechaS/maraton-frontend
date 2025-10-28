import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FavoritesPage.scss";
import {
  getFavoriteMovies,
  getMoviesByGenre,
  type Movie,
} from "../../services/movieService";
import { authService } from "../../services/authService";

interface MovieCategory {
  title: string;
  movies: Movie[];
  loading: boolean;
}

const FavoritesPage: FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<{
    [key: string]: MovieCategory;
  }>({
    terror: { title: "Terror", movies: [], loading: true },
    aventura: { title: "Aventura", movies: [], loading: true },
    accion: { title: "Acción", movies: [], loading: true },
    romance: { title: "Romance", movies: [], loading: true },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      // Redirect if not authenticated
      if (!authenticated) {
        navigate("/");
      }
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
  }, [navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Obtener TODAS las películas favoritas del usuario
        const allFavorites = await getFavoriteMovies();

        // 2. Crear un Set de IDs de favoritos para búsqueda rápida
        const favoriteIds = new Set(allFavorites.map((movie) => movie.id));

        // 3. Obtener películas por género y filtrar solo las que son favoritas
        const genrePromises = [
          { key: "terror", genre: "Terror", title: "Terror" },
          { key: "aventura", genre: "Aventura", title: "Aventura" },
          { key: "accion", genre: "Acción", title: "Acción" },
          { key: "romance", genre: "Romance", title: "Romance" },
        ].map(async ({ key, genre, title }) => {
          try {
            // Obtener todas las películas del género
            const genreMovies = await getMoviesByGenre(genre);

            // Filtrar solo las películas que están en favoritos
            const favoritesInGenre = genreMovies.filter((movie) =>
              favoriteIds.has(movie.id)
            );

            return {
              key,
              title,
              data: favoritesInGenre,
            };
          } catch (error) {
            console.error(`Error fetching ${genre} favorites:`, error);
            return {
              key,
              title,
              data: [],
            };
          }
        });

        // 4. Esperar todas las peticiones y actualizar el estado
        const results = await Promise.all(genrePromises);

        const newCategories: { [key: string]: MovieCategory } = {};
        results.forEach(({ key, title, data }) => {
          newCategories[key] = {
            title,
            movies: data,
            loading: false,
          };
        });

        setCategories(newCategories);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setCategories({
          terror: { title: "Terror", movies: [], loading: false },
          aventura: { title: "Aventura", movies: [], loading: false },
          accion: { title: "Acción", movies: [], loading: false },
          romance: { title: "Romance", movies: [], loading: false },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    // Listen for favorites changes
    const handleFavoritesChange = () => {
      fetchFavorites();
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__container">
          <h1 className="favorites-page__header">Mis Favoritos</h1>
          <div className="favorites-page__loading">Cargando favoritos...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const hasNoFavorites = Object.values(categories).every(
    (cat) => cat.movies.length === 0
  );

  return (
    <div className="favorites-page">
      <div className="favorites-page__container">
        <h1 className="favorites-page__header">Mis Favoritos</h1>

        {hasNoFavorites ? (
          <div className="favorites-page__empty">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61C20.3292 4.09913 19.7228 3.69374 19.0554 3.41731C18.3879 3.14088 17.6725 2.99878 16.95 2.99878C16.2275 2.99878 15.5121 3.14088 14.8446 3.41731C14.1772 3.69374 13.5708 4.09913 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3509 11.8792 21.7563 11.2728 22.0327 10.6054C22.3091 9.93789 22.4512 9.22248 22.4512 8.5C22.4512 7.77752 22.3091 7.06211 22.0327 6.39464C21.7563 5.72718 21.3509 5.12075 20.84 4.61Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2>No tienes películas favoritas aún</h2>
            <p>Explora el catálogo y agrega películas a tus favoritos</p>
            <button
              className="favorites-page__explore-button"
              onClick={() => navigate("/peliculas")}
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          Object.entries(categories).map(([key, category]) => (
            <MovieRow
              key={key}
              title={category.title}
              movies={category.movies}
              loading={category.loading}
            />
          ))
        )}
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
    const container = document.getElementById(`favorites-row-${title}`);
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
    const container = document.getElementById(`favorites-row-${title}`);
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

  // Siempre mostrar la fila, incluso si está vacía
  if (movies.length === 0) {
    return (
      <div className="video-row">
        <h2 className="video-row__title">{title}</h2>
        <div className="video-row__empty">
          No tienes películas favoritas en esta categoría
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

        <div className="video-row__container" id={`favorites-row-${title}`}>
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

export default FavoritesPage;
