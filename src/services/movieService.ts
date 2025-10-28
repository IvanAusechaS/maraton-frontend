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
  genero?: string; // Optional: genre name from backend
}

/**
 * Get movies by genre from backend
 * Returns an empty array if there's an error to prevent crashes
 */
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const movies = await api.get<Movie[]>(`/peliculas/genero/${genre}`);
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error(`Error fetching movies for genre ${genre}:`, error);
    return [];
  }
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
 * Returns an empty array if there's an error to prevent crashes
 */
export const getWatchLaterMovies = async (): Promise<Movie[]> => {
  try {
    const movies = await api.get<Movie[]>("/usuarios/watch-later");
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error("Error fetching watch later movies:", error);
    return [];
  }
};

/**
 * Get movie by ID
 */
export const getMovieById = async (id: number): Promise<Movie> => {
  const movie = await api.get<Movie>(`/peliculas/${id}`);
  return movie;
};

/**
 * Subtitulo and related types for file-based subtitle endpoint
 */
export interface Idioma {
  id: number;
  nombre: string;
  version: string;
}

export interface Subtitulo {
  id: number;
  estado: boolean;
  color: string;
  fuente: string;
  descriptiva: boolean;
  url: string;
  peliculaId: number;
  idiomaId: number;
  idioma: Idioma;
}

export interface SubtitlesResponse {
  peliculaId: number;
  titulo: string;
  subtitulos: Subtitulo[];
}

/**
 * Get subtitles for a specific movie (file-based .vtt/.srt links)
 * Returns an empty array if there's an error or no subtitles available
 */
export const getMovieSubtitles = async (
  movieId: number
): Promise<Subtitulo[]> => {
  try {
    // Intentar endpoint principal: /api/peliculas/:id/subtitulos
    const response = await api.get<SubtitlesResponse>(
      `/peliculas/${movieId}/subtitulos`
    );

    // Convert relative URLs to absolute URLs
    const backendBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    const subtitles = (response.subtitulos || []).map((subtitle) => ({
      ...subtitle,
      url: subtitle.url && subtitle.url.startsWith('http')
        ? subtitle.url
        : `${backendBaseUrl}${subtitle.url}`
    }));

    console.log(`✅ Subtítulos cargados para película ${movieId}:`, subtitles);
    return subtitles;
  } catch {
    // El backend actualmente usa formato JSON parseado, no archivos VTT
    console.warn(`⚠️ Endpoint /api/peliculas/${movieId}/subtitulos no disponible (el backend usa /api/subtitles con formato JSON)`);
    return [];
  }
};

/**
 * Parsed subtitle JSON endpoint (useful for YouTube or overlay rendering)
 */
export interface SubtitleLine {
  text: string;
  start: number;
  duration: number;
}

export interface ParsedSubtitle {
  idioma: string; // e.g. 'es', 'en'
  lineas: SubtitleLine[];
}

export const getParsedSubtitles = async (
  movieId: number
): Promise<ParsedSubtitle[]> => {
  try {
    // El backend devuelve un array con un objeto que contiene videoId y subtitulos
    const response = await api.get<{ videoId: string; subtitulos: ParsedSubtitle[] }[]>(
      `/subtitles/${movieId}`
    );
    
    // Extraer el array de subtítulos del primer elemento
    if (Array.isArray(response) && response.length > 0 && response[0].subtitulos) {
      console.log(`✅ Subtítulos parseados cargados para película ${movieId}:`, response[0].subtitulos);
      return response[0].subtitulos;
    }
    
    return [];
  } catch {
    console.warn(`⚠️ No se pudieron cargar subtítulos parseados para película ${movieId}`);
    return [];
  }
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
