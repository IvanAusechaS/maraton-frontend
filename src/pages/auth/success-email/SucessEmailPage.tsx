import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SucessEmailPage.scss";

/**
 * Success email page component
 * @component
 * @returns {JSX.Element} The success email confirmation page
 */
const SuccessEmailPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to login after 10 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-email-page">
      <div className="success-email-page__container">
        <div className="success-email-page__card">
          <button
            className="success-email-page__back"
            onClick={() => navigate("/")}
          >
            ← Regresar al inicio
          </button>

          <div className="success-email-page__icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#00c853" strokeWidth="2" />
              <path
                d="M8 12L11 15L16 9"
                stroke="#00c853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="success-email-page__title">
            ¡Correo enviado con éxito!
          </h1>

          <p className="success-email-page__message">
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por
            favor revisa tu bandeja de entrada y sigue las instrucciones para
            restablecer tu contraseña.
          </p>

          <div className="success-email-page__info">
            <p>
              <strong>Nota:</strong> Si no recibes el correo en los próximos
              minutos, revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>

          <button
            className="success-email-page__button"
            onClick={() => navigate("/login")}
          >
            IR A INICIAR SESIÓN
          </button>

          <div className="success-email-page__footer">
            <span>¿No recibiste el correo? </span>
            <button
              type="button"
              className="success-email-page__footer-link"
              onClick={() => navigate("/recuperar")}
            >
              Reenviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessEmailPage;
