/**
 * User Service
 * Handles user profile-related API calls
 */

import api, { ApiError } from "./api";
import { authService } from "./authService";

/**
 * User profile interface
 */
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  fecha_nacimiento?: string;
  fecha_registro?: string;
  peliculas_vistas?: number;
  series_seguidas?: number;
}

/**
 * Update user profile data
 */
export interface UpdateProfileData {
  username?: string;
  email?: string;
  fecha_nacimiento?: string;
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
 * User service class
 */
class UserService {
  /**
   * Get user profile from backend
   * GET /api/usuarios/:id
   */
  async getProfile(): Promise<UserProfile> {
    try {
      // Obtener el usuario actual del authService
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new ApiError("Usuario no autenticado", 401);
      }

      // Llamar al endpoint del backend GET /api/usuarios/:id
      const response = await api.get<UserProfile>(
        `/usuarios/${currentUser.id}`
      );

      return {
        ...response,
        fecha_registro: response.fecha_registro || new Date().toISOString(),
        peliculas_vistas: response.peliculas_vistas || 0,
        series_seguidas: response.series_seguidas || 0,
      };
    } catch (error) {
      console.error("Error loading profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile in backend
   * PUT /api/usuarios/:id
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new ApiError("Usuario no autenticado", 401);
      }

      // Preparar datos para enviar (solo los campos que vienen en data)
      const updateData: Record<string, string> = {};

      if (data.username !== undefined) updateData.username = data.username;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.fecha_nacimiento !== undefined)
        updateData.fecha_nacimiento = data.fecha_nacimiento;

      // Llamar al endpoint PUT /api/usuarios/:id
      const response = await api.put<UserProfile>(
        `/usuarios/${currentUser.id}`,
        updateData
      );

      // Actualizar el usuario en localStorage si es necesario
      if (response.email || response.username) {
        const updatedUser = {
          ...currentUser,
          email: response.email || currentUser.email,
          username: response.username || currentUser.username,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Change password
   * PUT /api/usuarios/:id/change-password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new ApiError("Usuario no autenticado", 401);
      }

      // Validar que las contraseñas nuevas coincidan
      if (data.newPassword !== data.confirmPassword) {
        throw new ApiError("Las contraseñas no coinciden", 400);
      }

      // Llamar al endpoint PUT /api/usuarios/:id/change-password
      const response = await api.put<{ message: string }>(
        `/usuarios/${currentUser.id}/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      );

      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }

  /**
   * Delete user account from backend
   * DELETE /api/usuarios/:id
   */
  async deleteAccount(): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new ApiError("Usuario no autenticado", 401);
      }

      // Llamar al endpoint DELETE /api/usuarios/:id
      await api.delete(`/usuarios/${currentUser.id}`);

      // Limpiar datos locales después de eliminar la cuenta
      authService.logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
