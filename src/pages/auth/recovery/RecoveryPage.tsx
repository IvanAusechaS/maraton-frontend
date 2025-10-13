import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecoveryPage.scss";
import authService from "../../../services/authService";
import { ApiError } from "../../../services/api";

/**
 * Recovery page component
 * @component
 * @returns {JSX.Element} The password recovery page
 */
const RecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.recoverPassword({ email });
      setSuccess(response.message);
      
      // Redirect to success page after showing success message
      setTimeout(() => {
        navigate("/exito");
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string } | undefined;
        setError(errorData?.message || "Error al enviar el correo de recuperación");
      } else {
        setError("Error de conexión. Por favor, intenta de nuevo.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-page__container">
        <div className="recovery-page__card">
          <button className="recovery-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>

          <div className="recovery-page__logo">
            <img src="/main-logo.svg" alt="Maraton Logo" />
          </div>

          <h1 className="recovery-page__title">Recuperar contraseña</h1>
          <p className="recovery-page__subtitle">
            Ingresa tu correo para recibir los pasos de recuperación
          </p>

          {error && (
            <div className="recovery-page__error">
              {error}
            </div>
          )}

          {success && (
            <div className="recovery-page__success">
              {success}
            </div>
          )}

          <form className="recovery-page__form" onSubmit={handleSubmit}>
            <div className="recovery-page__form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="recovery-page__input"
                placeholder=" "
                required
              />
              <label htmlFor="email" className="recovery-page__label">
                Correo electrónico
              </label>
            </div>

            <button
              type="submit"
              className="recovery-page__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "ENVIANDO..." : "ENVIAR ENLACE"}
            </button>

            <div className="recovery-page__login">
              <span>Recordaste tu contraseña? </span>
              <button
                type="button"
                className="recovery-page__login-link"
                onClick={() => navigate("/login")}
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPage;
