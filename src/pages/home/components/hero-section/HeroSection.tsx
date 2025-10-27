import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import authService from "../../../../services/authService";
import "./HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(authService.isAuthenticated());

    // Listen for auth changes
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate("/peliculas");
    } else {
      navigate("/registro");
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-section__logo">
        <img src="/main-logo.svg" alt="Maraton Logo" />
      </div>
      <h2 className="hero-section__subtitle">Explora el mejor contenido</h2>
      <button className="hero-section__cta" onClick={handleCtaClick}>
        {isAuthenticated ? "EXPLORAR CATÁLOGO" : "COMIENZA YA"}
      </button>
    </div>
  );
};

export default HeroSection;
