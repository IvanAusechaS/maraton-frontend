import React from "react";
import "./AboutPage.scss";
import { type FC } from "react";
import HeroSection from "../home/components/hero-section/HeroSection";
const AboutPage: FC = () => {
  return (
    <div className="about-page">
      <HeroSection />

      {/** Mission Section */}
      <section className="mission-section">
        <div className="mission-section__container">
          <h2 className="mission-section__title">Nuestra Misión</h2>
          <p className="mission-section__description">
            En MARATON, creemos que el entretenimiento de calidad debe estar al
            alcance de todos. Nos dedicamos a ofrecer una experiencia de
            streaming excepcional, combinando tecnología de calidad con un
            catálogo diverso y amplio.
          </p>

          <div className="mission-section__stats">
            <div className="stat-card">
              <h3 className="stat-card__number">10k+</h3>
              <p className="stat-card__label">Títulos disponibles</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card__number">1M+</h3>
              <p className="stat-card__label">Usuarios activos</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card__number">50+</h3>
              <p className="stat-card__label">Países</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card__number">24/7</h3>
              <p className="stat-card__label">Soporte</p>
            </div>
          </div>
        </div>
      </section>

      {/** Values Section */}
      <section className="values-section">
        <div className="values-section__container">
          <h2 className="values-section__title">Nuestros Valores</h2>

          <div className="values-section__grid">
            <div className="value-card">
              <div className="value-card__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="value-card__title">Pasión por el Contenido</h3>
              <p className="value-card__description">
                Seleccionamos cuidadosamente cada película y serie para
                ofrecerte la mejor experiencia de entretenimiento.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="value-card__title">Seguridad y Privacidad</h3>
              <p className="value-card__description">
                Protegemos tus datos con la más alta tecnología de encriptación
                y seguridad.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="value-card__title">Comunidad</h3>
              <p className="value-card__description">
                Creamos espacios para que compartas tus opiniones y descubras
                nuevas recomendaciones.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="value-card__title">Innovación Constante</h3>
              <p className="value-card__description">
                Actualizamos nuestra plataforma continuamente con nuevas
                funciones y mejoras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/** Content Classification Section */}
      <section className="classification-section">
        <div className="classification-section__container">
          <h2 className="classification-section__title">
            Clasificación de Contenido
          </h2>
          <p className="classification-section__subtitle">
            Nos tomamos muy en serio la clasificación de nuestro contenido para
            garantizar una experiencia apropiada para cada edad.
          </p>

          <div className="classification-section__grid">
            <div className="classification-card classification-card--green">
              <div className="classification-card__badge">ATP</div>
              <p className="classification-card__description">
                Apto para todo público
              </p>
            </div>

            <div className="classification-card classification-card--green">
              <div className="classification-card__badge">+13</div>
              <p className="classification-card__description">
                Mayores de 13 años
              </p>
            </div>

            <div className="classification-card classification-card--red">
              <div className="classification-card__badge">18+</div>
              <p className="classification-card__description">Solo adultos</p>
            </div>

            <div className="classification-card classification-card--green">
              <div className="classification-card__badge">STEM</div>
              <p className="classification-card__description">
                Contenido científico
              </p>
            </div>
          </div>
        </div>
      </section>

      {/** Policy and Regulation Section */}
      <section className="policy-section">
        <div className="policy-section__container">
          <h2 className="policy-section__title">Restricciones y Políticas</h2>

          <div className="policy-section__grid">
            <div className="policy-card policy-card--prohibited">
              <h3 className="policy-card__title">Contenido Prohibido</h3>
              <ul className="policy-card__list">
                <li>Violencia extrema o gratuita</li>
                <li>Contenido que promueva el odio</li>
                <li>Material ilegal o que viole derechos de autor</li>
                <li>Contenido de explotación o riesgo de menores</li>
              </ul>
            </div>

            <div className="policy-card policy-card--quality">
              <h3 className="policy-card__title">Compromisos de calidad</h3>
              <ul className="policy-card__list">
                <li>Todo el contenido es verificado antes de publicarse</li>
                <li>Calidad mínima garantizada de 1080p HD</li>
                <li>Subtítulos y audio en múltiples idiomas</li>
                <li>Actualizaciones semanales del catálogo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
