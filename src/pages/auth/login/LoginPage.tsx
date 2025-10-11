import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import mainLogo from "../../../../public/main-logo.svg";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__card">
          <button className="login-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>
          <div className="login-page__logo">
            <img src={mainLogo} alt="Maraton Logo" />
          </div>

          <h1 className="login-page__title">Ingresa a tu cuenta</h1>
          <p className="login-page__subtitle">
            Descubre qué está pasando en tu negocio
          </p>

          <form className="login-page__form" onSubmit={handleSubmit}>
            <div className="login-page__form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-page__input"
                required
              />
            </div>

            <div className="login-page__form-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-page__input"
                required
              />
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

            <button type="submit" className="login-page__submit">
              INGRESAR
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
