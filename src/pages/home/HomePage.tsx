import React from "react";
import "./HomePage.scss";
import { useNavigate } from "react-router";

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
      <h1>Nueva película</h1>
      <h2>Descripción de la nueva película</h2>
      <button onClick={() => navigate("peliculas")}>Ver ahora</button>
    </div>
  );
};

export default HomePage;
