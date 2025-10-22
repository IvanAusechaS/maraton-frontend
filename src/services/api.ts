/**
 * API Service Module
 *
 * Provides a centralized HTTP client for all API communications.
 * Implements cookie-based authentication, caching, retry logic, and comprehensive error handling.
 *
 * @module services/api
 *
 * @description
 * Features:
 * - HTTP-only cookie authentication (secure, XSS-protected)
 * - In-memory caching with configurable duration
 * - Automatic retry with exponential backoff
 * - Comprehensive error handling with custom ApiError class
 * - Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - TypeScript generic type support for type-safe responses
 * - CORS-compliant with credentials support
 *
 * @security
 * - HTTP-only cookies prevent XSS attacks
 * - credentials: 'include' ensures cookies sent with requests
 * - No token storage in localStorage/sessionStorage
 *
 * @performance
 * - 30-second cache duration for GET requests
 * - Retry logic with backoff for transient failures
 * - Lazy cache invalidation
 *
 * @robust
 * - Cross-browser compatible
 * - Network error recovery
 * - Graceful degradation on failures
 */

/**
 * Base URL for all API requests.
 * Falls back to localhost if environment variable not set.
 *
 * @constant
 * @type {string}
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * In-memory cache storage for GET requests.
 * Maps endpoint URLs to cached responses with timestamps.
 *
 * @type {Map<string, {data: unknown, timestamp: number}>}
 */
const cache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * Cache duration in milliseconds.
 * Cached responses are considered fresh for this duration.
 *
 * @constant
 * @type {number}
 */
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Utility function to pause execution for retry logic.
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after the specified duration
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom error class for API-related errors.
 * Extends native Error with HTTP status code and response data.
 *
 * @class ApiError
 * @extends Error
 *
 * @property {string} name - Error name, always "ApiError"
 * @property {number} status - HTTP status code (0 for network errors)
 * @property {unknown} [data] - Optional error response data from server
 *
 * @example
 * ```typescript
 * throw new ApiError("Unauthorized", 401, { message: "Invalid token" });
 * ```
 */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  /**
   * Creates an instance of ApiError.
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {unknown} [data] - Optional error data from response
   */
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
 * Core fetch wrapper with comprehensive features.
 * Handles caching, retries, authentication, and error management.
 *
 * @template T - Expected response type
 * @param {string} endpoint - API endpoint path (relative to base URL)
 * @param {RequestInit} [options={}] - Fetch API options
 * @param {number} [retries=2] - Number of retry attempts remaining
 * @returns {Promise<T>} Promise resolving to typed response data
 * @throws {ApiError} When request fails after all retries
 *
 * @description
 * Flow:
 * 1. Check cache for GET requests
 * 2. Add authentication headers (credentials: include)
 * 3. Execute fetch request
 * 4. Handle errors with retry logic (500 errors and network failures)
 * 5. Cache successful GET responses
 * 6. Return typed data
 *
 * Retry Logic:
 * - 500 errors: Retry with exponential backoff
 * - Network errors: Retry with exponential backoff
 * - Other errors: Fail immediately
 *
 * @example
 * ```typescript
 * const movies = await apiFetch<Movie[]>('/peliculas', { method: 'GET' });
 * ```
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
 * API client object exposing HTTP method wrappers.
 * Provides type-safe, Promise-based API for all HTTP operations.
 *
 * @namespace api
 *
 * @example
 * ```typescript
 * // GET request
 * const user = await api.get<User>('/usuarios/me');
 *
 * // POST request
 * const newMovie = await api.post<Movie>('/peliculas', { titulo: 'Test' });
 *
 * // PATCH request
 * await api.patch('/usuarios/favorites/123', { favorite: false });
 *
 * // Clear cache
 * api.clearCache('/peliculas');
 * ```
 */
export const api = {
  /**
   * Performs a GET HTTP request.
   * Automatically caches successful responses.
   *
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Promise resolving to typed response
   * @throws {ApiError} On request failure
   *
   * @example
   * ```typescript
   * const movies = await api.get<Movie[]>('/peliculas');
   * ```
   */
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * Performs a POST HTTP request.
   * Automatically serializes data to JSON.
   *
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data (will be JSON stringified)
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Promise resolving to typed response
   * @throws {ApiError} On request failure
   *
   * @example
   * ```typescript
   * const created = await api.post<Movie>('/peliculas', { titulo: 'New Movie' });
   * ```
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
   * Performs a PUT HTTP request.
   * Automatically serializes data to JSON.
   *
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data (will be JSON stringified)
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Promise resolving to typed response
   * @throws {ApiError} On request failure
   *
   * @example
   * ```typescript
   * const updated = await api.put<Movie>('/peliculas/123', movieData);
   * ```
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
   * Performs a PATCH HTTP request.
   * Automatically serializes data to JSON.
   * Used for partial updates.
   *
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data (will be JSON stringified)
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Promise resolving to typed response
   * @throws {ApiError} On request failure
   *
   * @example
   * ```typescript
   * await api.patch('/usuarios/favorites/123', { favorite: false });
   * ```
   */
  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Performs a DELETE HTTP request.
   *
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Promise resolving to typed response
   * @throws {ApiError} On request failure
   *
   * @example
   * ```typescript
   * await api.delete('/peliculas/123');
   * ```
   */
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
  },

  /**
   * Clears cached responses.
   * Can clear a specific endpoint or all cached data.
   *
   * @param {string} [endpoint] - Specific endpoint to clear (omit to clear all)
   *
   * @example
   * ```typescript
   * // Clear specific endpoint
   * api.clearCache('/peliculas');
   *
   * // Clear all cache
   * api.clearCache();
   * ```
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
