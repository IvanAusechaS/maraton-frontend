import api from "./api";

// Backend Movie interface - matches Prisma schema
export interface Movie {
  id: number;
  duracion: number;
  largometraje: string;
  actores: string;
  año: number;
  disponible: boolean;
  sinopsis: string;
  trailer: string;
  titulo: string;
  director: string;
  portada: string;
  idiomaId: number;
}

/**
 * Get movies by genre from backend
 */
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const movies = await api.get<Movie[]>(`/peliculas/genero/${genre}`);
  return movies;
};

/**
 * Response from getFavoriteMovies endpoint
 */
interface FavoritesResponse {
  total: number;
  movies: Movie[];
}

/**
 * Get user's favorite movies (requires authentication)
 */
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await api.get<FavoritesResponse>("/usuarios/favorites");
  return response.movies || [];
};

/**
 * Get user's watch later movies (requires authentication)
 */
export const getWatchLaterMovies = async (): Promise<Movie[]> => {
  const movies = await api.get<Movie[]>("/usuarios/watch-later");
  return movies;
};

/**
 * Get movie by ID
 */
export const getMovieById = async (id: number): Promise<Movie> => {
  const movie = await api.get<Movie>(`/peliculas/${id}`);
  return movie;
};

/**
 * Add movie to favorites
 * Creates or updates the Gusto preference with favoritos: true
 */
export const addToFavorites = async (movieId: number): Promise<void> => {
  await api.post("/usuarios/favorites", { peliculaId: movieId });
  // Clear favorites cache to force refresh
  api.clearCache("/usuarios/favorites");
};

/**
 * Remove movie from favorites
 * Updates the Gusto preference with favoritos: false (doesn't delete the record)
 */
export const removeFromFavorites = async (movieId: number): Promise<void> => {
  await api.patch(`/usuarios/favorites/${movieId}`, { favorite: false });
  // Clear favorites cache to force refresh
  api.clearCache("/usuarios/favorites");
};

/**
 * Check if a movie is in user's favorites
 */
export const checkIfFavorite = async (movieId: number): Promise<boolean> => {
  try {
    const response = await api.get<FavoritesResponse>("/usuarios/favorites");
    const favorites = response.movies || [];
    return favorites.some((movie) => movie.id === movieId);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

/**
 * Add movie to watch later
 */
export const addToWatchLater = async (movieId: number): Promise<void> => {
  await api.post(`/usuarios/watch-later/${movieId}`);
};

/**
 * Remove movie from watch later
 */
export const removeFromWatchLater = async (movieId: number): Promise<void> => {
  await api.delete(`/usuarios/watch-later/${movieId}`);
};

// ===== LEGACY PEXELS CODE (kept for reference, not used) =====
const PEXELS_API_KEY =
  "qo19orh1hqpe82bKV5yLFNPHv0gW17ODPZ2deOf3QauXXdj5SiudOevZ";
const PEXELS_API_URL = "https://api.pexels.com/v1";

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

export const searchVideos = async (
  query: string,
  page: number = 1,
  per_page: number = 10
): Promise<PexelsResponse> => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/videos/search?query=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos from Pexels");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const getPopularVideos = async (
  page: number = 1,
  per_page: number = 10
): Promise<PexelsResponse> => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/videos/popular?page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular videos from Pexels");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular videos:", error);
    throw error;
  }
};
