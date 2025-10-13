/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api, { setAuthToken, removeAuthToken } from './api';

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
 */
export interface LoginResponse {
  message: string;
  usuario: User;
  token: string;
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
   */
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      
      // Store token in localStorage
      if (response.token) {
        setAuthToken(response.token);
        // Optionally store user data
        localStorage.setItem('user', JSON.stringify(response.usuario));
        // Notify other parts of the app that auth state changed (same-tab listeners)
        try {
          window.dispatchEvent(new CustomEvent('authChanged'));
        } catch {}
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
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>('/auth/logout', {});
      
      // Clear token and user data
      removeAuthToken();
      localStorage.removeItem('user');
      // Notify listeners that auth state changed
      try {
        window.dispatchEvent(new CustomEvent('authChanged'));
      } catch {}
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if request fails
      removeAuthToken();
      localStorage.removeItem('user');
      try {
        window.dispatchEvent(new CustomEvent('authChanged'));
      } catch {}
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
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
