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
 * Favorites response interface from backend
 */
export interface FavoritesResponse {
  total: number;
  movies: Movie[];
}

/**
 * Get user's favorite movies (requires authentication)
 * GET /api/usuarios/favorites
 * Returns: { total: number, movies: Movie[] }
 */
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await api.get<FavoritesResponse>("/usuarios/favorites");
  return response.movies; // Extract movies array from response
};

/**
 * Get movie by ID
 */
export const getMovieById = async (id: number): Promise<Movie> => {
  const movie = await api.get<Movie>(`/peliculas/${id}`);
  return movie;
};

/**
 * Get all available movies
 * GET /api/peliculas
 */
export const getAllMovies = async (): Promise<Movie[]> => {
  const movies = await api.get<Movie[]>("/peliculas");
  return movies;
};

/**
 * Get all genres
 * GET /api/peliculas/generos
 */
export interface Genre {
  id: number;
  nombre: string;
  estado: boolean;
}

export const getAllGenres = async (): Promise<Genre[]> => {
  const genres = await api.get<Genre[]>("/peliculas/generos");
  return genres;
};

/**
 * Add movie to favorites
 * POST /api/usuarios/favorites
 * Body: { peliculaId: number }
 */
export const addToFavorites = async (movieId: number): Promise<void> => {
  await api.post("/usuarios/favorites", { peliculaId: movieId });
};

/**
 * Remove movie from favorites
 * DELETE /api/usuarios/favorites/:id
 */
export const removeFromFavorites = async (movieId: number): Promise<void> => {
  await api.patch(`/usuarios/favorites/${movieId}`, { favorite: false });
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
