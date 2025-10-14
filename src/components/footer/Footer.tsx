import { type FC, useState } from "react";
import "./Footer.scss";
import Modal from "../modal/Modal";

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
        <div className="footer__logo">
          <img src="/logo.svg" alt="Maraton Logo" />
        </div>

        <nav className="footer__links">
          <button
            className="footer__link"
            onClick={() => setActiveModal("cookies")}
          >
            Preferencias de cookies
          </button>
          <button
            className="footer__link"
            onClick={() => {
              window.location.href = "/#faq";
            }}
          >
            FAQ
          </button>
          <button
            className="footer__link"
            onClick={() => setActiveModal("privacy")}
          >
            Privacidad
          </button>
          <button
            className="footer__link"
            onClick={() => setActiveModal("terms")}
          >
            Términos de uso
          </button>
          <button
            className="footer__link"
            onClick={() => setActiveModal("accessibility")}
          >
            Accesibilidad
          </button>
          <a
            href={testSpeed}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Test de velocidad
          </a>
          <button
            className="footer__link"
            onClick={() => setActiveModal("contact")}
          >
            Contáctanos
          </button>
        </nav>

        <div className="footer__copyright">
          <p>
            @2025 Maraton Company, LLC. Todos los derechos reservados. Maraton
            es de uso libre
          </p>
        </div>

        <div className="footer__social">
          <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
            <img src="/youtube-icon.svg" alt="YouTube" />
          </a>
          <a href={tiktokLink} target="_blank" rel="noopener noreferrer">
            <img src="/tiktok-icon.svg" alt="TikTok" />
          </a>
          <a href={facebookLink} target="_blank" rel="noopener noreferrer">
            <img src="/facebook-icon.svg" alt="Facebook" />
          </a>
          <a href={instagramLink} target="_blank" rel="noopener noreferrer">
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
