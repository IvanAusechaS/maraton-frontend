import api from "./api";

/**
 * Comment interface - matches backend response
 */
export interface Comment {
  id: number;
  mensaje: string;
  usuarioId: number;
  peliculaId: number;
  comentarioPadreId: number | null;
  usuario: {
    id: number;
    username: string;
    email: string;
  };
  respuestas?: Comment[];
}

/**
 * Comments response from backend
 */
interface CommentsResponse {
  peliculaId: number;
  total: number;
  comentarios: Comment[];
}

/**
 * Rating statistics from backend
 */
export interface RatingStatistics {
  ratings: number[];
  total: number;
  average: number;
}

/**
 * Get all comments for a movie
 */
export const getCommentsByMovieId = async (
  movieId: number
): Promise<Comment[]> => {
  try {
    const response = await api.get<CommentsResponse>(`/comments/${movieId}`);
    return response.comentarios || [];
  } catch (error) {
    console.error(`Error fetching comments for movie ${movieId}:`, error);
    return [];
  }
};

/**
 * Create a new comment for a movie
 */
export const createComment = async (
  movieId: number,
  mensaje: string,
  comentarioPadreId?: number
): Promise<Comment> => {
  const data: {
    peliculaId: number;
    mensaje: string;
    comentarioPadreId?: number;
  } = {
    peliculaId: movieId,
    mensaje,
  };

  if (comentarioPadreId) {
    data.comentarioPadreId = comentarioPadreId;
  }

  const response = await api.post<{ comentario: Comment }>("/comments", data);
  return response.comentario;
};

/**
 * Update an existing comment
 */
export const updateComment = async (
  commentId: number,
  mensaje: string
): Promise<Comment> => {
  const response = await api.put<{ comentario: Comment }>(
    `/comments/${commentId}`,
    { mensaje }
  );
  return response.comentario;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

/**
 * Add or update a rating for a movie
 */
export const rateMovie = async (
  movieId: number,
  calificacion: number
): Promise<void> => {
  await api.post("/peliculas/ratings", {
    peliculaId: movieId,
    calificacion,
  });
};

/**
 * Get rating statistics for a movie
 */
export const getMovieRatings = async (
  movieId: number
): Promise<RatingStatistics> => {
  try {
    const response = await api.get<{ Calificaciones: RatingStatistics }>(
      `/peliculas/ratings/${movieId}`
    );
    return response.Calificaciones;
  } catch (error) {
    console.error(`Error fetching ratings for movie ${movieId}:`, error);
    return {
      ratings: [],
      total: 0,
      average: 0,
    };
  }
};

/**
 * Update a rating for a movie
 */
export const updateMovieRating = async (
  movieId: number,
  calificacion: number
): Promise<void> => {
  await api.put(`/peliculas/ratings/${movieId}`, {
    calificacion,
  });
};

/**
 * Delete a rating for a movie
 */
export const deleteMovieRating = async (movieId: number): Promise<void> => {
  await api.delete(`/peliculas/ratings/${movieId}`);
};
