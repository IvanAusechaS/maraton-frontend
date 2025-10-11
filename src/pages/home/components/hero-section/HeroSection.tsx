import { useNavigate } from "react-router";
import "./HeroSection.scss";
import mainLogo from "../../../../../public/main-logo.svg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HeroSection;