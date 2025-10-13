import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src="/lineal-logo.svg" alt="Maraton Logo" />
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
          <div
            className={`navbar__menu-button ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="navbar__mobile-menu">
            <Link to="/" className="navbar__link" onClick={handleLinkClick}>
              Inicio
            </Link>
            <Link to="/peliculas" className="navbar__link" onClick={handleLinkClick}>
              Catálogo
            </Link>
            <Link to="/sobre-nosotros" className="navbar__link" onClick={handleLinkClick}>
              Sobre nosotros
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;