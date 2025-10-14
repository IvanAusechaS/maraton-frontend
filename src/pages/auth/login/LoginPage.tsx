import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import authService from "../../../services/authService";
import { ApiError } from "../../../services/api";

/**
 * Login page component
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
      navigate("/peliculas");
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string } | undefined;
        setError(errorData?.message || "Credenciales inválidas");
      } else {
        setError("Error de conexión. Por favor, intenta de nuevo.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__card">
          <button className="login-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>
          <div className="login-page__logo">
            <img src="/main-logo.svg" alt="Maraton Logo" />
          </div>

          <h1 className="login-page__title">Ingresa a tu cuenta</h1>
          <p className="login-page__subtitle">
            Descubre qué está pasando en tu negocio
          </p>

          {error && (
            <div className="login-page__error">
              {error}
            </div>
          )}

          <form className="login-page__form" onSubmit={handleSubmit}>
            <div className="login-page__form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-page__input"
                placeholder=" "
                required
              />
              <label htmlFor="email" className="login-page__label">
                Email
              </label>
            </div>

            <div className="login-page__form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-page__input"
                placeholder=" "
                required
              />
              <label htmlFor="password" className="login-page__label">
                Contraseña
              </label>
            </div>

            <div className="login-page__options">
              <label className="login-page__checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                className="login-page__forgot"
                onClick={() => navigate("/recuperar")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button 
              type="submit" 
              className="login-page__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "INGRESANDO..." : "INGRESAR"}
            </button>

            <div className="login-page__register">
              <span>¿No tienes una cuenta? </span>
              <button
                type="button"
                className="login-page__register-link"
                onClick={() => navigate("/registro")}
              >
                Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
