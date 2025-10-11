import React from "react";
import "./HomePage.scss";
import { useNavigate } from "react-router";
import mainLogo from "../../../public/main-logo.svg";
import Carousel from "./components/carousel/Carousel";
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
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#faq") {
        setTimeout(() => {
          const faqSection = document.getElementById("faq");
          if (faqSection) {
            faqSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
      {/** Hero Section */}
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

      {/** Carousel Section */}
      <div className="carousel-section">
        <Carousel />
      </div>

      {/** Info Section */}
      <div className="info-section-reasons">
        <h2 className="info-section-reasons__title">Razones para ingresar</h2>
        <div className="info-section-reasons__container">
          <div className="reason-card">
            <h3 className="reason-card__title">Ver en cualquier lugar</h3>
            <p className="reason-card__description">
              Disfruta de tus películas favoritas desde cualquier dispositivo,
              en cualquier momento
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Contenido exclusivo</h3>
            <p className="reason-card__description">
              Accede a estrenos y contenido premium que no encontrarás en ningún
              otro lugar
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Sin interrupciones</h3>
            <p className="reason-card__description">
              Experiencia continua de visualización sin anuncios ni cortes
              publicitarios
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>

          <div className="reason-card">
            <h3 className="reason-card__title">Calidad garantizada</h3>
            <p className="reason-card__description">
              Contenido en alta definición con la mejor calidad de imagen y
              sonido
            </p>
            <img
              src="/reward.svg"
              alt="Reward icon"
              className="reason-card__icon"
            />
          </div>
        </div>
      </div>

      {/** FAQ Section */}
      <div id="faq" className="faq-section">
        <h2 className="faq-section__title">Preguntas Frecuentes</h2>
        <div className="faq-section__container">
          {[
            {
              question: "¿Qué es MARATON?",
              answer:
                "MARATON es tu plataforma de streaming preferida, donde encontrarás el mejor contenido de películas y series. Una experiencia única con contenido exclusivo, calidad HD y sin interrupciones publicitarias.",
            },
            {
              question: "¿Cómo me registro?",
              answer:
                "Registrarte es muy sencillo: haz clic en el botón 'COMIENZA YA', completa el formulario con tu correo y datos personales, elige tu plan de suscripción y ¡listo! Podrás empezar a disfrutar de todo nuestro contenido al instante.",
            },
            {
              question: "¿Dónde y cómo puedo ver?",
              answer:
                "Puedes ver todo nuestro contenido en cualquier dispositivo con conexión a internet: Smart TVs, smartphones, tablets, computadoras y consolas de videojuegos. Solo necesitas iniciar sesión en tu cuenta y empezar a disfrutar.",
            },
            {
              question: "¿Cuánto debo pagar?",
              answer:
                "Disfruta de todo nuestro contenido sin pagar un solo peso. Nuestra plataforma es completamente gratuita, sin planes de suscripción ni cargos ocultos. Accede libremente a nuestro extenso catálogo de películas y series en la mejor calidad, cuando quieras y desde cualquier dispositivo. ¡Solo entra, elige tu película favorita y disfruta!",
            },
            {
              question: "¿Es seguro usar la plataforma?",
              answer:
                "Absolutamente. Utilizamos tecnología de encriptación de última generación para proteger tus datos personales y métodos de pago. Además, contamos con un sistema de control parental para que toda la familia pueda disfrutar de forma segura.",
            },
          ].map((faq, index) => (
            <div
              className="faq-item"
              key={index}
              onClick={() => handleFaqClick(index)}
            >
              <div className="faq-item__header">
                <h3>{faq.question}</h3>
                <img
                  src="/arrow-color.svg"
                  alt="Toggle answer"
                  className={`faq-item__icon ${
                    expandedFaq === index ? "rotated" : ""
                  }`}
                />
              </div>
              <div
                className={`faq-item__content ${
                  expandedFaq === index ? "expanded" : ""
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
