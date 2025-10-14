import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService, type UserProfile } from "../../../services/userService";
import { authService } from "../../../services/authService";
import { ApiError } from "../../../services/api";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Default profile data (sin datos reales)
  const getDefaultProfile = (): UserProfile => ({
    id: 0,
    email: "correo@dominio.com",
    username: "Usuario",
    nombre_completo: "Nombre Apellido",
    ubicacion: "Calim Colombia",
    fecha_registro: new Date().toISOString(),
    peliculas_vistas: 127,
    series_seguidas: 23,
  });

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar desde el backend
      const data = await userService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Error loading profile:", err);

      if (err instanceof ApiError && err.status === 401) {
        // Token expirado o inválido - redirigir al login
        authService.logout();
        navigate("/login");
        return;
      }

      // Si hay error de red o backend no disponible, usar datos predeterminados
      if (err instanceof ApiError && err.status === 0) {
        // Backend no disponible - cargar datos predeterminados
        const localUser = authService.getCurrentUser();
        if (localUser) {
          setProfile({
            id: localUser.id,
            email: localUser.email,
            username: localUser.username,
            nombre_completo: localUser.username,
            ubicacion: "Calim Colombia",
            fecha_registro: new Date().toISOString(),
            peliculas_vistas: 127,
            series_seguidas: 23,
          });
        } else {
          setProfile(getDefaultProfile());
        }
        setError("Modo offline: Mostrando datos locales");
      } else {
        // Otro tipo de error
        setProfile(getDefaultProfile());
        setError(
          "No se pudo cargar el perfil. Mostrando información predeterminada."
        );
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

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `Miembro desde ${month} ${year}`;
    } catch {
      return "Fecha no disponible";
    }
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(true);
    setDeleteButtonDisabled(true);
    setCountdown(3);

    // Countdown timer
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
      alert("Error al eliminar la cuenta. Por favor, inténtalo de nuevo.");
      handleDeleteCancel();
    }
  };

  const displayProfile = profile || getDefaultProfile();

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="profile-content">
          {/* Left Section - User Info */}
          <div className="user-info-section">
            <div className="avatar-circle">
              {getInitials(
                displayProfile.nombre_completo || "",
                displayProfile.username
              )}
            </div>
            <h2 className="user-name">
              {displayProfile.nombre_completo || displayProfile.username}
            </h2>
            <p className="user-email">{displayProfile.email}</p>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">
                  {displayProfile.peliculas_vistas || 0}
                </span>
                <span className="stat-label">Películas vistas</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">
                  {displayProfile.series_seguidas || 0}
                </span>
                <span className="stat-label">Series seguidas</span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="info-section">
              <h3 className="section-title">Información personal</h3>
              <p className="section-subtitle">
                Gestiona tu información personal y de contacto
              </p>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="info-content">
                  <p className="info-label">
                    {displayProfile.nombre_completo || "Nombre Completo"}
                  </p>
                  <p className="info-value">Nombre Completo</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="info-content">
                  <p className="info-label">{displayProfile.email}</p>
                  <p className="info-value">Dirección de email</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="info-content">
                  <p className="info-label">
                    {displayProfile.ubicacion || "No especificada"}
                  </p>
                  <p className="info-value">Ubicación</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="info-content">
                  <p className="info-label">
                    {formatDate(displayProfile.fecha_registro)}
                  </p>
                  <p className="info-value">Fecha de registro</p>
                </div>
              </div>

              <button className="edit-button" onClick={handleEditProfile}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
            </div>
          </div>

          {/* Right Section - Password & Delete Account */}
          <div className="actions-section">
            {/* Change Password */}
            <div className="password-section">
              <h3 className="section-title">Cambia tu contraseña</h3>

              <div className="password-input-group">
                <label>Digita tu contraseña actual:</label>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  disabled
                />
              </div>

              <div className="password-input-group">
                <label>Digita tu nueva contraseña:</label>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  disabled
                />
              </div>

              <div className="password-input-group">
                <label>Confirma tu nueva contraseña:</label>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  disabled
                />
              </div>

              <button className="change-password-button" disabled>
                CAMBIAR CONTRASEÑA
              </button>

              <p className="info-text">
                Para cambiar tu contraseña, ve a la página de edición de perfil
              </p>
            </div>

            {/* Delete Account */}
            <div className="delete-section">
              <h3 className="section-title">Eliminar tu cuenta</h3>
              <p className="warning-text">Esta es una acción irreversible.</p>

              <button className="delete-button" onClick={handleDeleteAccount}>
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - First */}
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

      {/* Delete Confirmation Modal - Second with Timer */}
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

export default ProfilePage;
