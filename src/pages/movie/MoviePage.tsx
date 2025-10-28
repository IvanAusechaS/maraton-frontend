import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviePage.scss";
import {
  getMoviesByGenre,
  type Movie,
} from "../../services/movieService";
import { getMovieRatings } from "../../services/commentService";

interface MovieCategory {
  title: string;
  movies: Movie[];
  loading: boolean;
  visible: boolean;
}

const MoviePage: FC = () => {
  const [categories, setCategories] = useState<{
    [key: string]: MovieCategory;
  }>({
    terror: { title: "Terror", movies: [], loading: true, visible: true },
    aventura: { title: "Aventura", movies: [], loading: true, visible: true },
    accion: { title: "Acción", movies: [], loading: true, visible: true },
    romance: { title: "Romance", movies: [], loading: true, visible: true },
  });

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
  }, []);

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
  const [movieRatings, setMovieRatings] = useState<{
    [key: number]: number;
  }>({});

  // Load ratings for all movies in this row
  useEffect(() => {
    const loadRatings = async () => {
      const ratings: { [key: number]: number } = {};

      for (const movie of movies) {
        try {
          const ratingData = await getMovieRatings(movie.id);
          if (ratingData.total > 0) {
            ratings[movie.id] = ratingData.average;
          }
        } catch (error) {
          console.error(`Error loading rating for movie ${movie.id}:`, error);
        }
      }

      setMovieRatings(ratings);
    };

    if (movies.length > 0) {
      loadRatings();
    }
  }, [movies]);

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
          {title === "Favoritos"
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
                  <div className="video-card__meta">
                    <span className="video-card__duration">
                      {movie.duracion} min
                    </span>
                    {movieRatings[movie.id] && (
                      <>
                        <span className="video-card__separator">•</span>
                        <span className="video-card__rating">
                          ⭐ {movieRatings[movie.id].toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
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
