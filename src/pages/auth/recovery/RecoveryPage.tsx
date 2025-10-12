import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecoveryPage.scss";
import mainLogo from "../../../../public/main-logo.svg";

/**
 * Recovery page component
 * @component
 * @returns {JSX.Element} The password recovery page
 */
const RecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement password recovery logic
    console.log("Recovery email sent to:", email);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/exito");
    }, 1500);
  };

  return (
    <div className="recovery-page">
      <div className="recovery-page__container">
        <div className="recovery-page__card">
          <button className="recovery-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>

          <div className="recovery-page__logo">
            <img src={mainLogo} alt="Maraton Logo" />
          </div>

          <h1 className="recovery-page__title">Recuperar contraseña</h1>
          <p className="recovery-page__subtitle">
            Ingresa tu correo para recibir los pasos de recuperación
          </p>

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
