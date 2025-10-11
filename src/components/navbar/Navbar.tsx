import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import linealLogo from "../../../public/lineal-logo.svg";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src={linealLogo} alt="Maraton Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="navbar__links desktop-menu">
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

        <div className="navbar__actions">
          <Link to="/login" className="navbar__auth-button">
            INICIAR SESIÓN
          </Link>

          {/* Hamburger Button */}
          <button
            className={`navbar__menu-button ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar__mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="navbar__link" onClick={toggleMenu}>
            Inicio
          </Link>
          <Link to="/peliculas" className="navbar__link" onClick={toggleMenu}>
            Catálogo
          </Link>
          <Link
            to="/sobre-nosotros"
            className="navbar__link"
            onClick={toggleMenu}
          >
            Sobre nosotros
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
