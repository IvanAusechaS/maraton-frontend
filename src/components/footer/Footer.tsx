import { type FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import Modal from "../modal/Modal";
import { authService } from "../../services/authService";

const testSpeed = "https://fast.com/es";
const instagramLink = "https://www.instagram.com/maraton_app/";
const facebookLink = "https://www.facebook.com/maraton_app/";
const youtubeLink = "https://www.youtube.com/@maraton_app";
const tiktokLink = "https://www.tiktok.com/@maraton_app";

type ModalType =
  | "cookies"
  | "privacy"
  | "terms"
  | "accessibility"
  | "contact"
  | null;

const Footer: FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());

    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const modalContents = {
    cookies: {
      title: "Preferencias de Cookies",
      content: (
        <>
          <h3>¿Qué son las cookies?</h3>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web
            colocan en tu dispositivo mientras navegas. Estas herramientas son
            fundamentales para proporcionar una experiencia de usuario óptima y
            personalizada.
          </p>

          <h3>¿Cómo utilizamos las cookies?</h3>
          <ul>
            <li>
              Cookies esenciales: Necesarias para el funcionamiento básico del
              sitio
            </li>
            <li>
              Cookies de rendimiento: Nos ayudan a mejorar el rendimiento del
              sitio
            </li>
            <li>
              Cookies de funcionalidad: Mejoran tu experiencia de navegación
            </li>
            <li>Cookies de publicidad: Personalizan los anuncios que ves</li>
          </ul>

          <h3>Tus opciones</h3>
          <p>
            Puedes gestionar tus preferencias de cookies en cualquier momento.
            Ten en cuenta que deshabilitar ciertas cookies puede afectar la
            funcionalidad del sitio.
          </p>
        </>
      ),
    },
    privacy: {
      title: "Política de Privacidad",
      content: (
        <>
          <h3>Compromiso con tu privacidad</h3>
          <p>
            En MARATON, la protección de tus datos personales es una prioridad.
            Nos comprometemos a ser transparentes sobre cómo recopilamos, usamos
            y protegemos tu información.
          </p>

          <h3>Información que recopilamos</h3>
          <ul>
            <li>Datos de perfil y preferencias</li>
            <li>Historial de visualización</li>
            <li>Información de dispositivo y uso</li>
            <li>Datos de facturación (si aplica)</li>
          </ul>

          <h3>Cómo protegemos tus datos</h3>
          <p>
            Implementamos medidas de seguridad robustas y actualizadas
            constantemente para proteger tu información contra accesos no
            autorizados y mantener la integridad de tus datos.
          </p>
        </>
      ),
    },
    terms: {
      title: "Términos de Uso",
      content: (
        <>
          <h3>Acuerdo de usuario</h3>
          <p>
            Al utilizar MARATON, aceptas cumplir con estos términos de uso.
            Nuestro servicio está diseñado para proporcionar una experiencia de
            streaming segura y agradable para todos los usuarios.
          </p>

          <h3>Uso aceptable</h3>
          <ul>
            <li>Respetar los derechos de autor y propiedad intelectual</li>
            <li>No compartir credenciales de cuenta</li>
            <li>
              No usar VPNs o proxies para evadir restricciones geográficas
            </li>
            <li>Mantener la seguridad de tu cuenta</li>
          </ul>

          <h3>Modificaciones del servicio</h3>
          <p>
            MARATON se reserva el derecho de modificar o discontinuar el
            servicio en cualquier momento, notificando a los usuarios cuando sea
            posible.
          </p>
        </>
      ),
    },
    accessibility: {
      title: "Accesibilidad",
      content: (
        <>
          <h3>Nuestro compromiso</h3>
          <p>
            En MARATON nos esforzamos por hacer que nuestro contenido sea
            accesible para todos los usuarios, independientemente de sus
            capacidades.
          </p>

          <h3>Características de accesibilidad</h3>
          <ul>
            <li>Subtítulos y audio descripciones</li>
            <li>Navegación por teclado</li>
            <li>Compatibilidad con lectores de pantalla</li>
            <li>Ajustes de contraste y tamaño de texto</li>
          </ul>

          <h3>Mejora continua</h3>
          <p>
            Trabajamos constantemente para mejorar la accesibilidad de nuestra
            plataforma y agradecemos tus comentarios para hacer MARATON más
            inclusivo.
          </p>
        </>
      ),
    },
    contact: {
      title: "Contáctanos",
      content: (
        <>
          <h3>Estamos aquí para ayudarte</h3>
          <p>
            Tu opinión es importante para nosotros. Si tienes preguntas,
            sugerencias o necesitas ayuda, no dudes en contactarnos.
          </p>

          <h3>Canales de contacto</h3>
          <ul>
            <li>Correo electrónico: soporte@maraton.com</li>
            <li>Chat en vivo: Disponible 24/7</li>
            <li>Redes sociales: Respuesta en 24 horas</li>
            <li>Centro de ayuda: FAQ y guías</li>
          </ul>

          <h3>Horario de atención</h3>
          <p>
            Nuestro equipo de soporte está disponible las 24 horas del día, los
            7 días de la semana para asistirte en lo que necesites.
          </p>
        </>
      ),
    },
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Sitemap Section */}
        <nav className="footer__sitemap" aria-label="Mapa del sitio">
          <div className="footer__sitemap-section">
            <h3 className="footer__sitemap-title">Navegación</h3>
            <ul className="footer__sitemap-list">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/peliculas">Películas</Link>
              </li>
              <li>
                <Link to="/sobre-nosotros">Sobre Nosotros</Link>
              </li>
            </ul>
          </div>

          {!isAuthenticated ? (
            <div className="footer__sitemap-section">
              <h3 className="footer__sitemap-title">Cuenta</h3>
              <ul className="footer__sitemap-list">
                <li>
                  <Link to="/login">Iniciar Sesión</Link>
                </li>
                <li>
                  <Link to="/registro">Registrarse</Link>
                </li>
                <li>
                  <Link to="/recuperar">Recuperar Contraseña</Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="footer__sitemap-section">
              <h3 className="footer__sitemap-title">Mi Cuenta</h3>
              <ul className="footer__sitemap-list">
                <li>
                  <Link to="/perfil">Ver Perfil</Link>
                </li>
                <li>
                  <Link to="/profile/edit">Editar Perfil</Link>
                </li>
              </ul>
            </div>
          )}

          <div className="footer__sitemap-section">
            <h3 className="footer__sitemap-title">Ayuda</h3>
            <ul className="footer__sitemap-list">
              <li>
                <button
                  onClick={() => setActiveModal("contact")}
                  className="footer__sitemap-link"
                >
                  Contáctanos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.location.href = "/#faq";
                  }}
                  className="footer__sitemap-link"
                >
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <a 
                  href="/docs/Manual_de_usuario.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__sitemap-link"
                >
                  Manual de Usuario
                </a>
              </li>
              <li>
                <a href={testSpeed} target="_blank" rel="noopener noreferrer">
                  Test de Velocidad
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__sitemap-section">
            <h3 className="footer__sitemap-title">Legal</h3>
            <ul className="footer__sitemap-list">
              <li>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="footer__sitemap-link"
                >
                  Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("terms")}
                  className="footer__sitemap-link"
                >
                  Términos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("cookies")}
                  className="footer__sitemap-link"
                >
                  Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("accessibility")}
                  className="footer__sitemap-link"
                >
                  Accesibilidad
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="footer__logo">
          <img src="/logo.svg" alt="Maraton" />
        </div>

        <div className="footer__copyright">
          <p>
            © 2025 Maraton Company, LLC. Todos los derechos reservados. Maraton
            es de uso libre
          </p>
        </div>

        <div className="footer__social">
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img src="/youtube-icon.svg" alt="YouTube" />
          </a>
          <a
            href={tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <img src="/tiktok-icon.svg" alt="TikTok" />
          </a>
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/facebook-icon.svg" alt="Facebook" />
          </a>
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/instagram-icon.svg" alt="Instagram" />
          </a>
        </div>
      </div>

      {activeModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={modalContents[activeModal].title}
        >
          {modalContents[activeModal].content}
        </Modal>
      )}
    </footer>
  );
};

export default Footer;
