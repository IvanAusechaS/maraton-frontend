/**
 * Base API configuration and HTTP client setup
 * Handles authentication with HTTP-only cookies, error handling, and request/response interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * DEPRECATED: Token management moved to HTTP-only cookies
 * These functions are kept for backwards compatibility but do nothing
 * @deprecated Use HTTP-only cookies instead
 */
export const setAuthToken = (token: string): void => {
  // Tokens are now handled by HTTP-only cookies set by the server
  void token; // Suppress unused parameter warning
  console.warn('setAuthToken is deprecated. Authentication now uses HTTP-only cookies.');
};

/**
 * DEPRECATED: Token removal moved to HTTP-only cookies
 * @deprecated Use HTTP-only cookies instead
 */
export const removeAuthToken = (): void => {
  // Tokens are now handled by HTTP-only cookies cleared by the server
  console.warn('removeAuthToken is deprecated. Authentication now uses HTTP-only cookies.');
};

/**
 * Base fetch wrapper with error handling and cookie-based authentication
 * Cookies are automatically sent by the browser with credentials: 'include'
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Include credentials to send HTTP-only cookies
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important: sends cookies with cross-origin requests
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Error en la solicitud',
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Error de conexión con el servidor',
      0,
      error
    );
  }
}

/**
 * HTTP methods wrapper functions
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

export default api;
