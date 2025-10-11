import React from "react";
import "./HomePage.scss";
import { useNavigate } from "react-router";
import mainLogo from "../../../public/main-logo.svg";
import Carousel from "./components/carousel/Carousel";
/**
 * Home (landing) page of the application.
 *
 * @component
 * @returns {JSX.Element} The landing view with a CTA button to browse movies.
 * @example
 * // Renders a title, subtitle, and a button that navigates to "/peliculas"
 * <HomePage />
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/** Hero Section */}
      <div className="hero-section">
        <div className="hero-section__logo">
          <img src={mainLogo} alt="Maraton Logo" />
        </div>
        <h2 className="hero-section__subtitle">Explora el mejor contenido</h2>
        <button
          className="hero-section__cta"
          onClick={() => navigate("registro")}
        >
          COMIENZA YA
        </button>
      </div>

      {/** Carousel Section */}
      <div className="carousel-section">
        <Carousel />
      </div>

      {/** Info Section */}
      <div className="info-section-reasons">
        <h2 className="info-section-reasons__title">Razones para ingresar</h2>
        <div className="info-section-reasons__container">
          <div className="reason-card">
            <h3 className="reason-card__title">Ver en cualquier lugar</h3>
            <p className="reason-card__description">
              Disfruta de tus películas favoritas desde cualquier dispositivo,
              en cualquier momento
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Contenido exclusivo</h3>
            <p className="reason-card__description">
              Accede a estrenos y contenido premium que no encontrarás en ningún
              otro lugar
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Sin interrupciones</h3>
            <p className="reason-card__description">
              Experiencia continua de visualización sin anuncios ni cortes
              publicitarios
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Calidad garantizada</h3>
            <p className="reason-card__description">
              Contenido en alta definición con la mejor calidad de imagen y
              sonido
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;
