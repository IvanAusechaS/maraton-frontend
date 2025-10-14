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
        setError(
          errorData?.message || "Error al enviar el correo de recuperación"
        );
      } else {
        setError("Error de conexión. Por favor, intenta de nuevo.");
      }
      setIsSubmitting(false);

      // Focus on error message for accessibility
      setTimeout(() => {
        document.getElementById("error-message")?.focus();
      }, 100);
    }
  };

  return (
    <div className="recovery-page" role="main">
      <div className="recovery-page__container">
        <div className="recovery-page__card">
          <button
            className="recovery-page__back"
            onClick={() => navigate("/")}
            aria-label="Regresar a la página de inicio"
          >
            ← Regresar al inicio
          </button>

          <div className="recovery-page__logo">
            <img
              src="/main-logo.svg"
              alt="Logotipo de Maraton - Plataforma de streaming"
            />
          </div>

          <h1 className="recovery-page__title">Recuperar contraseña</h1>
          <p className="recovery-page__subtitle">
            Ingresa tu correo para recibir los pasos de recuperación
          </p>

          {error && (
            <div
              className="recovery-page__error"
              role="alert"
              aria-live="assertive"
              id="error-message"
              tabIndex={-1}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div
              className="recovery-page__success"
              role="alert"
              aria-live="polite"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          )}

          <form
            className="recovery-page__form"
            onSubmit={handleSubmit}
            aria-label="Formulario de recuperación de contraseña"
            noValidate
          >
            <div className="recovery-page__form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="recovery-page__input"
                placeholder=" "
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                autoComplete="email"
              />
              <label htmlFor="email" className="recovery-page__label">
                Correo electrónico
              </label>
            </div>

            <button
              type="submit"
              className="recovery-page__submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && (
                <span className="spinner" aria-hidden="true"></span>
              )}
              {isSubmitting ? "ENVIANDO..." : "ENVIAR ENLACE"}
            </button>

            <div className="recovery-page__login">
              <span>Recordaste tu contraseña? </span>
              <button
                type="button"
                className="recovery-page__login-link"
                onClick={() => navigate("/login")}
                aria-label="Ir a página de inicio de sesión"
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
