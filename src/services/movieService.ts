import api from "./api";

// Backend Movie interface
export interface Movie {
  id: number;
  titulo: string;
  descripcion: string;
  duracion: number;
  portada: string;
  video_url: string;
  calificacion: number;
  genero: string;
  fecha_lanzamiento: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get movies by genre from backend
 */
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const movies = await api.get<Movie[]>(`/peliculas/genero/${genre}`);
  return movies;
};

/**
 * Get user's favorite movies (requires authentication)
 */
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  const movies = await api.get<Movie[]>("/usuarios/favorites");
  return movies;
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
 */
export const addToFavorites = async (movieId: number): Promise<void> => {
  await api.post(`/usuarios/favorites/${movieId}`);
};

/**
 * Remove movie from favorites
 */
export const removeFromFavorites = async (movieId: number): Promise<void> => {
  await api.delete(`/usuarios/favorites/${movieId}`);
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
