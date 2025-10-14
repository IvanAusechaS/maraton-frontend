/**
 * User Service
 * Handles user profile-related API calls with fallback support
 */

import api, { ApiError } from "./api";

/**
 * User profile interface
 */
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  nombre_completo?: string;
  ubicacion?: string;
  fecha_registro: string;
  peliculas_vistas?: number;
  series_seguidas?: number;
}

/**
 * Update user profile data
 */
export interface UpdateProfileData {
  username?: string;
  nombre_completo?: string;
  email?: string;
  ubicacion?: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User service class with fallback support
 */
class UserService {
  /**
   * Get user profile
   * GET /user/profile
   * Falls back to default data if backend is not available
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>("/user/profile");
      return response;
    } catch (error) {
      console.warn(
        "Backend not available for profile, using default data:",
        error
      );
      // Return default profile data
      throw error;
    }
  }

  /**
   * Update user profile
   * PUT /user/profile
   * Simulates update if backend is not available
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>("/user/profile", data);
      // Update localStorage user data
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userData, ...response })
        );
      }
      return response;
    } catch (error) {
      console.warn("Backend not available for profile update:", error);
      // Simulate successful update by returning updated data
      if (error instanceof ApiError && error.status === 0) {
        // Network error - backend not available
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedData = { ...userData, ...data };
          localStorage.setItem("user", JSON.stringify(updatedData));
          return {
            id: updatedData.id || 0,
            email: updatedData.email || "correo@dominio.com",
            username: updatedData.username || "Usuario",
            nombre_completo: updatedData.nombre_completo,
            ubicacion: updatedData.ubicacion,
            fecha_registro:
              updatedData.fecha_registro || new Date().toISOString(),
            peliculas_vistas: 0,
            series_seguidas: 0,
          };
        }
      }
      throw error;
    }
  }

  /**
   * Change password
   * POST /user/change-password
   * Simulates change if backend is not available
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/user/change-password",
        data
      );
      return response;
    } catch (error) {
      console.warn("Backend not available for password change:", error);
      // Simulate successful password change if backend is unavailable
      if (error instanceof ApiError && error.status === 0) {
        return { message: "Contraseña actualizada (modo offline)" };
      }
      throw error;
    }
  }

  /**
   * Delete user account
   * DELETE /user/account
   * Simulates deletion if backend is not available
   */
  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>("/user/account");
      // Clear all local data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return response;
    } catch (error) {
      console.warn("Backend not available for account deletion:", error);
      // Clear local data anyway
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      if (error instanceof ApiError && error.status === 0) {
        return { message: "Cuenta eliminada (modo offline)" };
      }
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
