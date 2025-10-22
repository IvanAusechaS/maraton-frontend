/**
 * Base API configuration and HTTP client setup
 * Handles authentication with HTTP-only cookies, error handling, and request/response interceptors
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Sleep utility for retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
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
};

/**
 * DEPRECATED: Token removal moved to HTTP-only cookies
 * @deprecated Use HTTP-only cookies instead
 */
export const removeAuthToken = (): void => {
  // Tokens are now handled by HTTP-only cookies cleared by the server
};

/**
 * Base fetch wrapper with error handling and cookie-based authentication
 * Cookies are automatically sent by the browser with credentials: 'include'
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  // Check cache first for GET requests
  if ((!options.method || options.method === "GET") && retries === 2) {
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Include credentials to send HTTP-only cookies
  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Important: sends cookies with cross-origin requests
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle different response statuses
    if (!response.ok) {
      // Retry on 500 errors if retries are available
      if (response.status === 500 && retries > 0) {
        await sleep(1000 * (3 - retries)); // Backoff: 1s, 2s
        return apiFetch<T>(endpoint, options, retries - 1);
      }

      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Try again later",
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    // Cache successful GET requests
    if (!options.method || options.method === "GET") {
      cache.set(endpoint, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Retry on network errors if retries are available
    if (retries > 0) {
      await sleep(1000 * (3 - retries));
      return apiFetch<T>(endpoint, options, retries - 1);
    }

    // Network or other errors
    throw new ApiError("Connection error", 0, error);
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
    return apiFetch<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * POST request
   */
  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
  },

  /**
   * Clear cache for specific endpoint or all cache
   */
  clearCache: (endpoint?: string): void => {
    if (endpoint) {
      cache.delete(endpoint);
    } else {
      cache.clear();
    }
  },
};

export default api;
