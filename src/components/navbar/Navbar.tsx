import type { FC } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import linealLogo from "../../../public/lineal-logo.svg";


const Navbar: FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src={linealLogo} alt="Maraton Logo" />
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">
            Inicio
          </Link>
          <Link to="/peliculas" className="navbar__link">
            Catálogo
          </Link>
          <Link to="/sobre-nosotros" className="navbar__link">
            Sobre nosotros
          </Link>
        </div>

        <Link to="/login" className="navbar__auth-button">
          INICIAR SESIÓN
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
