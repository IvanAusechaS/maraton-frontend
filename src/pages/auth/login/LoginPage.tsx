import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import authService from "../../../services/authService";
import { ApiError } from "../../../services/api";

/**
 * Login page component with WCAG accessibility and usability heuristics
 *
 * Heuristics implemented:
 * 1. Visibility of system status - Loading states and clear error messages
 * 2. Error prevention - Input validation and required fields
 * 3. Recognition rather than recall - Labels and placeholders
 * 4. Consistency and standards - Standard form patterns
 * 5. Help and documentation - Clear error messages and password recovery
 *
 * WCAG compliance:
 * - Proper ARIA labels and roles
 * - Keyboard navigation support
 * - Screen reader support
 * - Error identification
 * - Focus management
 *
 * @component
 * @returns {JSX.Element} The login page
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await authService.login({
        email,
        password,
      });

      console.log("Login exitoso:", response);

      // TODO: Implement remember me functionality
      // if (rememberMe) {
      //   localStorage.setItem("rememberMe", "true");
      // }

      // Redirect to home or dashboard
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string } | undefined;
        setError(
          errorData?.message ||
            "Credenciales inválidas. Por favor, verifica tu email y contraseña."
        );
      } else {
        setError(
          "Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo."
        );
      }
      setIsSubmitting(false);

      // Focus on error message for screen readers
      setTimeout(() => {
        document.getElementById("error-message")?.focus();
      }, 100);
    }
  };

  return (
    <div className="login-page" role="main">
      <div className="login-page__container">
        <div className="login-page__card">
          {/* Heurística: User control and freedom - Easy navigation back */}
          <button
            className="login-page__back"
            onClick={() => navigate("/")}
            aria-label="Regresar al inicio"
          >
            ← Regresar al inicio
          </button>

          <div className="login-page__logo">
            <img
              src="/main-logo.svg"
              alt="Logotipo de Maraton - Plataforma de streaming"
            />
          </div>

          <h1 className="login-page__title">Ingresa a tu cuenta</h1>
          <p className="login-page__subtitle">
            Accede a todo tu contenido favorito
          </p>

          {/* WCAG: Error Identification - Clear, visible error messages */}
          {error && (
            <div
              className="login-page__error"
              role="alert"
              aria-live="assertive"
              id="error-message"
              tabIndex={-1}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form
            className="login-page__form"
            onSubmit={handleSubmit}
            aria-label="Formulario de inicio de sesión"
            noValidate
          >
            {/* Heurística: Recognition rather than recall - Clear labels */}
            <div className="login-page__form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-page__input"
                placeholder=" "
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "error-message" : undefined}
                autoComplete="email"
              />
              <label htmlFor="email" className="login-page__label">
                Correo electrónico
              </label>
            </div>

            <div className="login-page__form-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-page__input"
                placeholder=" "
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "error-message" : undefined}
                autoComplete="current-password"
              />
              <label htmlFor="password" className="login-page__label">
                Contraseña
              </label>
              {/* Heurística: Flexibility and efficiency - Show/hide password */}
              <button
                type="button"
                className="login-page__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                tabIndex={0}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="login-page__options">
              {/* WCAG: Accessible checkbox with proper labeling */}
              <label className="login-page__checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  aria-label="Recordar mi sesión"
                />
                <span>Recordarme</span>
              </label>

              {/* Heurística: Help and documentation - Easy password recovery */}
              <button
                type="button"
                className="login-page__forgot"
                onClick={() => navigate("/recuperar")}
                aria-label="Ir a recuperación de contraseña"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Heurística: Visibility of system status - Clear loading state */}
            <button
              type="submit"
              className="login-page__submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  INGRESANDO...
                </>
              ) : (
                "INGRESAR"
              )}
            </button>

            {/* Heurística: Recognition - Clear call to action for new users */}
            <div className="login-page__register">
              <span>¿No tienes una cuenta? </span>
              <button
                type="button"
                className="login-page__register-link"
                onClick={() => navigate("/registro")}
                aria-label="Ir a página de registro"
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
