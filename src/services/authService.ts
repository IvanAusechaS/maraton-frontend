/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Uses HTTP-only cookies for secure token management
 */

import api from './api';

/**
 * User interface based on backend response
 */
export interface User {
  id: number;
  email: string;
  username: string;
  fecha_nacimiento: string;
  edad?: number;
}

/**
 * Register request data
 */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
  birth_date: string; // Format: YYYY-MM-DD
}

/**
 * Register response
 */
export interface RegisterResponse {
  message: string;
  usuario: User;
}

/**
 * Login request data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Login response
 * Note: Token is now sent in HTTP-only cookie, not in response body
 */
export interface LoginResponse {
  message: string;
  usuario: User;
}

/**
 * Recover password request data
 */
export interface RecoverPasswordData {
  email: string;
}

/**
 * Recover password response
 */
export interface RecoverPasswordResponse {
  message: string;
}

/**
 * Reset password request data
 */
export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

/**
 * Reset password response
 */
export interface ResetPasswordResponse {
  message: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Authentication service class
 */
class AuthService {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * POST /auth/login
   * Note: Authentication token is now handled by HTTP-only cookies set by the server
   */
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      
      // Store only user data in localStorage (not the token)
      // Token is automatically stored in HTTP-only cookie by the server
      if (response.usuario) {
        localStorage.setItem('user', JSON.stringify(response.usuario));
        // Notify other parts of the app that auth state changed
        try {
          window.dispatchEvent(new CustomEvent('authChanged'));
        } catch (err) {
          console.warn('Failed to dispatch authChanged event', err);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Request password recovery
   * POST /auth/recover
   */
  async recoverPassword(data: RecoverPasswordData): Promise<RecoverPasswordResponse> {
    try {
      const response = await api.post<RecoverPasswordResponse>('/auth/recover', data);
      return response;
    } catch (error) {
      console.error('Password recovery error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * POST /auth/reset/:token
   */
  async resetPassword(token: string, data: ResetPasswordData): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post<ResetPasswordResponse>(
        `/auth/reset/${token}`,
        data
      );
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   * Note: Server clears the HTTP-only cookie
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>('/auth/logout', {});
      
      // Clear user data from localStorage
      // Cookie is cleared by the server
      localStorage.removeItem('user');
      // Notify listeners that auth state changed
      try {
        window.dispatchEvent(new CustomEvent('authChanged'));
      } catch (err) {
        console.warn('Failed to dispatch authChanged event', err);
      }
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if request fails
      localStorage.removeItem('user');
      try {
        window.dispatchEvent(new CustomEvent('authChanged'));
      } catch (err) {
        console.warn('Failed to dispatch authChanged event', err);
      }
      throw error;
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   * With HTTP-only cookies, we check if user data exists in localStorage
   * The actual authentication token is in a secure HTTP-only cookie
   */
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
