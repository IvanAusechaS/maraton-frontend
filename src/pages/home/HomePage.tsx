import React from "react";
import "./HomePage.scss";
import { useNavigate } from "react-router";
import mainLogo from "../../../public/main-logo.svg";
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
      <div className="hero-section">
        <div className="hero-section__logo">
          <img src={mainLogo} alt="Maraton Logo" />
        </div>
        <h2 className="hero-section__subtitle">Explora el mejor contenido</h2>
        <button
          className="hero-section__cta"
          onClick={() => navigate("peliculas")}
        >
          COMIENZA YA
        </button>
      </div>
    </div>
  );
};

export default HomePage;
