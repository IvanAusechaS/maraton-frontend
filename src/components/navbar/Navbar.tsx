import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import authService from "../../services/authService";

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const user = authService.getCurrentUser();
        setUserName(user?.username || "Usuario");
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserName("");
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
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

        {/* Desktop Actions */}
        <div className="navbar__actions">
          {!isAuthenticated ? (
            <Link to="/login" className="navbar__auth-button">
              INICIAR SESIÓN
            </Link>
          ) : (
            <div className="navbar__user-menu">
              <button
                className="navbar__user-button"
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <div className="navbar__user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="navbar__user-name">{userName}</span>
                <svg
                  className={`navbar__user-arrow ${isUserMenuOpen ? "active" : ""}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="navbar__user-dropdown">
                  <Link
                    to="/perfil"
                    className="navbar__dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
                    </svg>
                    Mi Perfil
                  </Link>
                  <Link
                    to="/mis-peliculas"
                    className="navbar__dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H12L11 0H5L4 2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2ZM8 13C5.79 13 4 11.21 4 9C4 6.79 5.79 5 8 5C10.21 5 12 6.79 12 9C12 11.21 10.21 13 8 13Z" fill="currentColor"/>
                    </svg>
                    Mis Películas
                  </Link>
                  <Link
                    to="/configuracion"
                    className="navbar__dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.4 7.6L14.54 6.46C14.68 6.32 14.68 6.1 14.54 5.96L13.04 4.46C12.9 4.32 12.68 4.32 12.54 4.46L11.4 5.6C11.04 5.34 10.64 5.14 10.2 5L10 3.5C10 3.34 9.86 3.2 9.7 3.2H7.3C7.14 3.2 7 3.34 7 3.5L6.8 5C6.36 5.14 5.96 5.34 5.6 5.6L4.46 4.46C4.32 4.32 4.1 4.32 3.96 4.46L2.46 5.96C2.32 6.1 2.32 6.32 2.46 6.46L3.6 7.6C3.34 7.96 3.14 8.36 3 8.8L1.5 9C1.34 9 1.2 9.14 1.2 9.3V11.7C1.2 11.86 1.34 12 1.5 12L3 12.2C3.14 12.64 3.34 13.04 3.6 13.4L2.46 14.54C2.32 14.68 2.32 14.9 2.46 15.04L3.96 16.54C4.1 16.68 4.32 16.68 4.46 16.54L5.6 15.4C5.96 15.66 6.36 15.86 6.8 16L7 17.5C7 17.66 7.14 17.8 7.3 17.8H9.7C9.86 17.8 10 17.66 10 17.5L10.2 16C10.64 15.86 11.04 15.66 11.4 15.4L12.54 16.54C12.68 16.68 12.9 16.68 13.04 16.54L14.54 15.04C14.68 14.9 14.68 14.68 14.54 14.54L13.4 13.4C13.66 13.04 13.86 12.64 14 12.2L15.5 12C15.66 12 15.8 11.86 15.8 11.7V9.3C15.8 9.14 15.66 9 15.5 9L14 8.8C13.86 8.36 13.66 7.96 13.4 7.6ZM8.5 12C6.84 12 5.5 10.66 5.5 9C5.5 7.34 6.84 6 8.5 6C10.16 6 11.5 7.34 11.5 9C11.5 10.66 10.16 12 8.5 12Z" fill="currentColor"/>
                    </svg>
                    Configuración
                  </Link>
                  <div className="navbar__dropdown-divider"></div>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M10.5 11.5L14 8L10.5 4.5M14 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}

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
            
            {/* Mobile User Section */}
            {isAuthenticated ? (
              <>
                <div className="navbar__mobile-divider"></div>
                <div className="navbar__mobile-user">
                  <div className="navbar__mobile-user-info">
                    <div className="navbar__user-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="navbar__mobile-user-name">{userName}</span>
                  </div>
                </div>
                <Link to="/perfil" className="navbar__link" onClick={handleLinkClick}>
                  Mi Perfil
                </Link>
                <Link to="/mis-peliculas" className="navbar__link" onClick={handleLinkClick}>
                  Mis Películas
                </Link>
                <Link to="/configuracion" className="navbar__link" onClick={handleLinkClick}>
                  Configuración
                </Link>
                <button
                  className="navbar__mobile-logout"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <div className="navbar__mobile-divider"></div>
                <Link to="/login" className="navbar__link" onClick={handleLinkClick}>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="navbar__link" onClick={handleLinkClick}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;