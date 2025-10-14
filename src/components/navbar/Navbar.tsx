import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import authService from "../../services/authService";

type FilterOption = {
  key: string;
  label: string;
};

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");

  const FILTERS: FilterOption[] = [
    { key: "todas", label: "Todas" },
    { key: "familiar", label: "Familiar" },
    { key: "terror", label: "Terror" },
    { key: "accion", label: "Acción" },
    { key: "romance", label: "Romance" },
  ];

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

    // Listen for storage changes (other tabs) and same-tab auth changes
    const onStorage = () => checkAuth();
    const onAuthChanged = () => checkAuth();

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged as EventListener);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSelectFilter = (filterLabel: string) => {
    setSelectedFilter(filterLabel);
    setIsFilterOpen(false);
    // Notify interested components about filter change
    try {
      window.dispatchEvent(
        new CustomEvent("filterChanged", { detail: { filter: filterLabel } })
      );
    } catch {
      // ignore
    }
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
        {/* Block 1: Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/lineal-logo.svg" alt="Maraton" />
        </Link>

        {/* Block 2: Main navigation links */}
        <div className="navbar__main-links desktop-menu">
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

        {/* Block 3: Filter + Search */}
        <div className="navbar__tools desktop-menu">
          <div className="navbar__filter">
            <button
              className={`navbar__filter-button ${
                isFilterOpen ? "active" : ""
              }`}
              onClick={toggleFilter}
              aria-haspopup="true"
              aria-expanded={isFilterOpen}
            >
              {selectedFilter}
              <img
                src="/arrow-color.svg"
                alt="toggle"
                className={`navbar__filter-arrow ${
                  isFilterOpen ? "active" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="navbar__filter-dropdown">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className="navbar__filter-item"
                    onClick={() => handleSelectFilter(f.label)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="navbar__search-button" aria-label="Buscar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Block 4: Actions (authentication and menu toggle) */}
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
                  className={`navbar__user-arrow ${
                    isUserMenuOpen ? "active" : ""
                  }`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                        fill="currentColor"
                      />
                    </svg>
                    Mi Perfil
                  </Link>
                  <div className="navbar__dropdown-divider"></div>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M10.5 11.5L14 8L10.5 4.5M14 8H6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
            <Link
              to="/peliculas"
              className="navbar__link"
              onClick={handleLinkClick}
            >
              Catálogo
            </Link>
            <Link
              to="/sobre-nosotros"
              className="navbar__link"
              onClick={handleLinkClick}
            >
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
                <Link
                  to="/perfil"
                  className="navbar__link"
                  onClick={handleLinkClick}
                >
                  Mi Perfil
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
                <Link
                  to="/login"
                  className="navbar__link"
                  onClick={handleLinkClick}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="navbar__link"
                  onClick={handleLinkClick}
                >
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
