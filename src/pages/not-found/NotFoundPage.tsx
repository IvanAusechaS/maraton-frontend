import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.scss";

/**
 * 404 Not Found page component
 * @component
 * @returns {JSX.Element} The 404 error page
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page" role="main">
      <div className="not-found-page__container">
        <div className="not-found-page__card">
          <div className="not-found-page__error-code" aria-label="Error 404">
            404
          </div>

          <div className="not-found-page__logo">
            <img
              src="/main-logo.svg"
              alt="Logotipo de Maraton - Plataforma de streaming"
            />
          </div>

          <h1 className="not-found-page__title">Página no encontrada</h1>

          <p className="not-found-page__message">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida. Por favor, verifica la URL o regresa al inicio.
          </p>

          <div className="not-found-page__actions">
            <button
              className="not-found-page__button primary"
              onClick={() => navigate("/")}
              aria-label="Volver a la página de inicio"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Volver al inicio
            </button>

            <button
              className="not-found-page__button secondary"
              onClick={() => navigate(-1)}
              aria-label="Volver a la página anterior"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Página anterior
            </button>
          </div>

          <div className="not-found-page__help" role="note">
            <p>¿Necesitas ayuda? Prueba con:</p>
            <ul>
              <li>
                <button
                  onClick={() => navigate("/")}
                  aria-label="Ir a la página de inicio"
                >
                  Ir al inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/login")}
                  aria-label="Ir a la página de inicio de sesión"
                >
                  Iniciar sesión
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  aria-label="Ir a la página acerca de nosotros"
                >
                  Acerca de nosotros
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
