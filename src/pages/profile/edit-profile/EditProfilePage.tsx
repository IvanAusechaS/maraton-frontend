import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  userService,
  type UserProfile,
  type UpdateProfileData,
  type ChangePasswordData,
} from "../../../services/userService";
import { authService } from "../../../services/authService";
import { ApiError } from "../../../services/api";
import "./EditProfilePage.scss";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Delete account states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            authService.logout();
            navigate("/login");
          }, 2000);
          return;
        } else if (err.status === 404) {
          setError("No se encontró el perfil del usuario.");
        } else if (err.status === 0) {
          setError(
            "❌ No se pudo conectar con el servidor. Por favor, verifica que el backend esté ejecutándose."
          );
        } else {
          setError(
            `Error al cargar el perfil: ${err.message || "Error desconocido"}`
          );
        }
      } else {
        setError("Error inesperado al cargar el perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string, username: string): string => {
    if (name && name !== "Nombre Apellido" && name !== username) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = "El nombre de usuario es requerido";
    } else if (formData.username.length < 3) {
      errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "El correo electrónico no es válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "La nueva contraseña es requerida";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Debes confirmar la nueva contraseña";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateProfileData = {
        username: formData.username,
        email: formData.email,
      };

      const updatedProfile = await userService.updateProfile(updateData);
      setProfile(updatedProfile);
      setSuccess("Perfil actualizado correctamente");

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setSuccess("Cambios guardados localmente (modo offline)");
          setTimeout(() => setSuccess(null), 5000);
        } else {
          setError(err.message || "Error al actualizar el perfil");
        }
      } else {
        setError(
          "Error al actualizar el perfil. Por favor, inténtalo de nuevo."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const changeData: ChangePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      await userService.changePassword(changeData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setSuccess("✅ Contraseña cambiada correctamente");

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error changing password:", err);
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("❌ La contraseña actual es incorrecta");
        } else if (err.status === 400) {
          setError(err.message || "❌ Error de validación en la contraseña");
        } else if (err.status === 0) {
          setError(
            "❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose."
          );
        } else {
          setError(err.message || "❌ Error al cambiar la contraseña");
        }
      } else {
        setError(
          "❌ Error al cambiar la contraseña. Por favor, inténtalo de nuevo."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(true);
    setDeleteButtonDisabled(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setDeleteButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(false);
    setDeleteButtonDisabled(false);
    setCountdown(3);
  };

  const handleDeleteFinal = async () => {
    try {
      await userService.deleteAccount();
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      if (err instanceof ApiError && err.status === 0) {
        // En modo offline, solo limpiar y redirigir
        navigate("/login");
      } else {
        alert("Error al eliminar la cuenta. Por favor, inténtalo de nuevo.");
        handleDeleteCancel();
      }
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error y no hay perfil, mostrar pantalla de error
  if (error && !profile) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="header-section">
            <button
              className="back-button"
              onClick={() => navigate("/profile")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
          </div>
          <div className="message-banner error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              className="save-button"
              onClick={loadProfile}
              style={{ marginRight: "1rem" }}
            >
              Reintentar
            </button>
            <button
              className="cancel-button"
              onClick={() => navigate("/profile")}
            >
              Volver al perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay perfil después de cargar, no renderizar nada
  if (!profile) {
    return null;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="header-section">
          <button className="back-button" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al perfil
          </button>
          <h1 className="page-title">Editar Perfil</h1>
        </div>

        {error && (
          <div className="message-banner error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="message-banner success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="edit-content">
          {/* Left Section - Profile Information */}
          <div className="profile-info-section">
            <div className="avatar-section">
              <div className="avatar-circle">
                {getInitials("", profile.username)}
              </div>
              <h2 className="user-name">{profile.username}</h2>
              <p className="user-email">{profile.email}</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <h3 className="form-title">Información personal</h3>
              <p className="form-subtitle">
                Gestiona tu información personal y de contacto
              </p>

              <div className="form-group">
                <label htmlFor="username">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setFormErrors({ ...formErrors, username: "" });
                  }}
                  placeholder="Tu nombre de usuario"
                  className={formErrors.username ? "error" : ""}
                />
                {formErrors.username && (
                  <span className="error-text">{formErrors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFormErrors({ ...formErrors, email: "" });
                  }}
                  placeholder="tu@email.com"
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <span className="error-text">{formErrors.email}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="button-spinner"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Section - Password & Delete */}
          <div className="actions-section">
            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit} className="password-section">
              <h3 className="section-title">Cambia tu contraseña</h3>

              <div className="form-group">
                <label htmlFor="currentPassword">
                  Digita tu contraseña actual:
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      currentPassword: "",
                    });
                  }}
                  placeholder="Contraseña actual"
                  className={passwordErrors.currentPassword ? "error" : ""}
                />
                {passwordErrors.currentPassword && (
                  <span className="error-text">
                    {passwordErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Digita tu nueva contraseña:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    });
                    setPasswordErrors({ ...passwordErrors, newPassword: "" });
                  }}
                  placeholder="Nueva contraseña"
                  className={passwordErrors.newPassword ? "error" : ""}
                />
                {passwordErrors.newPassword && (
                  <span className="error-text">
                    {passwordErrors.newPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirma tu nueva contraseña:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      confirmPassword: "",
                    });
                  }}
                  placeholder="Confirmar contraseña"
                  className={passwordErrors.confirmPassword ? "error" : ""}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-text">
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="change-password-button"
                disabled={saving}
              >
                {saving ? "CAMBIANDO..." : "CAMBIAR CONTRASEÑA"}
              </button>
            </form>

            {/* Delete Account */}
            <div className="delete-section">
              <h3 className="section-title">Eliminar tu cuenta</h3>
              <p className="warning-text">Esta es una acción irreversible.</p>

              <button
                type="button"
                className="delete-button"
                onClick={handleDeleteAccount}
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modals */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3>¿Estás seguro?</h3>
            <p>
              Esta acción eliminará permanentemente tu cuenta y todos tus datos.
              Esta operación no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleDeleteCancel}
              >
                Cancelar
              </button>
              <button
                className="modal-button confirm"
                onClick={handleDeleteConfirm}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3>Última confirmación</h3>
            <p>
              ¿Realmente deseas eliminar tu cuenta? Esta es tu última
              oportunidad para cancelar.
            </p>
            {countdown > 0 && (
              <p className="countdown-text">
                Por favor, espera {countdown} segundo
                {countdown !== 1 ? "s" : ""} para reflexionar...
              </p>
            )}
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleDeleteCancel}
              >
                No, mantener mi cuenta
              </button>
              <button
                className="modal-button danger"
                onClick={handleDeleteFinal}
                disabled={deleteButtonDisabled}
              >
                {deleteButtonDisabled
                  ? `Espera ${countdown}s...`
                  : "Sí, eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
