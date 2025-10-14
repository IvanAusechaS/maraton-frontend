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
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar__container">
        {/* Block 1: Logo */}
        <Link
          to="/"
          className="navbar__logo"
          aria-label="Ir al inicio de Maraton"
        >
          <img src="/lineal-logo.svg" alt="Logotipo de Maraton" />
        </Link>

        {/* Block 2: Main navigation links */}
        <div className="navbar__main-links desktop-menu">
          <Link
            to="/"
            className="navbar__link"
            aria-label="Ir a la página de inicio"
          >
            Inicio
          </Link>
          <Link
            to="/peliculas"
            className="navbar__link"
            aria-label="Ver catálogo de películas"
          >
            Catálogo
          </Link>
          <Link
            to="/sobre-nosotros"
            className="navbar__link"
            aria-label="Conocer más sobre nosotros"
          >
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
              aria-label={`Filtrar por categoría. Filtro actual: ${selectedFilter}`}
            >
              {selectedFilter}
              <img
                src="/arrow-color.svg"
                alt=""
                role="presentation"
                className={`navbar__filter-arrow ${
                  isFilterOpen ? "active" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div
                className="navbar__filter-dropdown"
                role="menu"
                aria-label="Opciones de filtrado"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className="navbar__filter-item"
                    onClick={() => handleSelectFilter(f.label)}
                    role="menuitem"
                    aria-label={`Filtrar por ${f.label}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="navbar__search-button"
            aria-label="Abrir búsqueda de películas"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
            <Link
              to="/login"
              className="navbar__auth-button"
              aria-label="Iniciar sesión en tu cuenta"
            >
              INICIAR SESIÓN
            </Link>
          ) : (
            <div className="navbar__user-menu">
              <button
                className="navbar__user-button"
                onClick={toggleUserMenu}
                aria-label={`Menú de usuario. Usuario actual: ${userName}`}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <div className="navbar__user-avatar" aria-hidden="true">
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
                  aria-hidden="true"
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
                <div
                  className="navbar__user-dropdown"
                  role="menu"
                  aria-label="Opciones de cuenta"
                >
                  <Link
                    to="/perfil"
                    className="navbar__dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                    aria-label="Ver mi perfil"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                        fill="currentColor"
                      />
                    </svg>
                    Mi Perfil
                  </Link>
                  <div
                    className="navbar__dropdown-divider"
                    role="separator"
                  ></div>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={handleLogout}
                    role="menuitem"
                    aria-label="Cerrar sesión y salir de la cuenta"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
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
          <button
            className={`navbar__menu-button ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label={
              isMenuOpen
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="navbar__mobile-menu"
            id="mobile-menu"
            role="menu"
            aria-label="Menú de navegación móvil"
          >
            <Link
              to="/"
              className="navbar__link"
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="Ir a inicio"
            >
              Inicio
            </Link>
            <Link
              to="/peliculas"
              className="navbar__link"
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="Ver catálogo"
            >
              Catálogo
            </Link>
            <Link
              to="/sobre-nosotros"
              className="navbar__link"
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="Sobre nosotros"
            >
              Sobre nosotros
            </Link>

            {/* Mobile User Section */}
            {isAuthenticated ? (
              <>
                <div className="navbar__mobile-divider" role="separator"></div>
                <div className="navbar__mobile-user">
                  <div className="navbar__mobile-user-info">
                    <div className="navbar__user-avatar" aria-hidden="true">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="navbar__mobile-user-name">{userName}</span>
                  </div>
                </div>
                <Link
                  to="/perfil"
                  className="navbar__link"
                  onClick={handleLinkClick}
                  role="menuitem"
                  aria-label="Ver mi perfil"
                >
                  Mi Perfil
                </Link>
                <button
                  className="navbar__mobile-logout"
                  onClick={handleLogout}
                  role="menuitem"
                  aria-label="Cerrar sesión"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <div className="navbar__mobile-divider" role="separator"></div>
                <Link
                  to="/login"
                  className="navbar__link"
                  onClick={handleLinkClick}
                  role="menuitem"
                  aria-label="Iniciar sesión"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="navbar__link"
                  onClick={handleLinkClick}
                  role="menuitem"
                  aria-label="Crear cuenta"
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
