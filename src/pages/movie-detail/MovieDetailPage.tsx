import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetailPage.scss";

/**
 * Movie detail page component.
 * Displays comprehensive information about a selected movie.
 *
 * @component
 * @returns {JSX.Element} Movie detail view with all movie information
 * @example
 * <MovieDetailPage />
 *
 * @accessibility
 * - Semantic HTML structure for screen readers
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Focus management for buttons
 * - Alt text for images
 * - High contrast text for readability
 *
 * @wcag
 * - WCAG 2.1 Level AA compliant
 * - 4.5:1 contrast ratio for text
 * - Touch targets minimum 44x44px
 * - Responsive design for all devices
 */

// Mock data for movies - será reemplazado cuando el backend esté listo
// Para cualquier ID que venga de videos externos, usamos una película por defecto
interface Movie {
  id: string;
  titulo: string;
  director: string;
  duracion: number;
  año: number;
  genero: string[];
  clasificacion: string;
  disponibilidad: string;
  actores: string[];
  sinopsis: string;
  poster: string;
}

const mockMoviesData: { [key: string]: Movie } = {
  "1": {
    id: "1",
    titulo: "Stranger Things",
    director: "Matt Duffer, Ross Duffer",
    duracion: 51,
    año: 2016,
    genero: ["Drama", "Fantasía", "Terror"],
    clasificacion: "16+",
    disponibilidad: "Disponible",
    actores: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"],
    sinopsis:
      "En 1983, en el pequeño pueblo de Hawkins, Indiana, un niño desaparece misteriosamente durante una noche aparentemente normal. Mientras sus amigos, familiares y la policía local buscan respuestas, se ven envueltos en un misterio extraordinario que involucra experimentos gubernamentales secretos, fuerzas sobrenaturales aterradoras y una niña muy extraña con habilidades psíquicas. A medida que la búsqueda se intensifica, descubren un mundo alternativo oscuro y peligroso que existe en paralelo al suyo, conocido como el 'Upside Down'. Los habitantes de Hawkins deben enfrentar sus miedos más profundos y unirse para combatir una amenaza que podría destruir su mundo tal como lo conocen. Entre tensiones familiares, secretos gubernamentales y criaturas de pesadilla, un grupo de niños demuestra que el coraje y la amistad pueden ser las armas más poderosas contra las fuerzas de la oscuridad.",
    poster:
      "https://images.pexels.com/photos/2752777/pexels-photo-2752777.jpeg",
  },
  "2": {
    id: "2",
    titulo: "Star Wars: A New Hope",
    director: "George Lucas",
    duracion: 121,
    año: 1977,
    genero: ["Ciencia Ficción", "Aventura", "Acción"],
    clasificacion: "13+",
    disponibilidad: "Disponible",
    actores: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    sinopsis:
      "En una galaxia muy, muy lejana, el malvado Imperio Galáctico ha construido la Estrella de la Muerte, una estación espacial con el poder de destruir planetas enteros. La Princesa Leia, líder de la Alianza Rebelde, logra robar los planos de esta terrible arma, pero es capturada por el temible Lord Darth Vader. Los planos caen en manos de Luke Skywalker, un joven granjero de Tatooine que sueña con aventuras más allá de su árido planeta. Guiado por el misterioso Obi-Wan Kenobi, un antiguo Caballero Jedi, Luke se embarca en una misión épica para rescatar a la princesa y entregar los planos a la Rebelión. Junto al contrabandista Han Solo, su copiloto Chewbacca y los droides R2-D2 y C-3PO, Luke descubrirá su verdadero destino y aprenderá sobre el poder místico de la Fuerza. En una batalla final contra el tiempo, deberá usar sus nuevas habilidades para ayudar a destruir la Estrella de la Muerte antes de que el Imperio aplaste definitivamente toda esperanza de libertad en la galaxia.",
    poster:
      "https://images.pexels.com/photos/28310406/pexels-photo-28310406.jpeg",
  },
  "3": {
    id: "3",
    titulo: "The Mandalorian",
    director: "Jon Favreau",
    duracion: 40,
    año: 2019,
    genero: ["Ciencia Ficción", "Western", "Aventura"],
    clasificacion: "13+",
    disponibilidad: "Disponible",
    actores: ["Pedro Pascal", "Gina Carano", "Carl Weathers"],
    sinopsis:
      "Cinco años después de la caída del Imperio Galáctico, en los confines más alejados de la galaxia donde la ley de la Nueva República apenas tiene alcance, un solitario cazarrecompensas mandaloriano conocido simplemente como 'Mando' se gana la vida capturando fugitivos peligrosos. Conocido por su armadura de beskar y su estricto código de honor, acepta un trabajo misterioso que lo lleva a un planeta remoto. Lo que descubre allí cambiará su vida para siempre: un pequeño ser de la misma especie que el legendario Maestro Yoda, al que todos llaman 'El Niño' o 'Grogu'. A pesar de su naturaleza solitaria y su entrenamiento para no mostrar emociones, el Mandaloriano desarrolla un vínculo protector con la criatura. Perseguidos por remanentes del Imperio que desean capturar al niño por sus habilidades en la Fuerza, Mando debe viajar por la galaxia, enfrentando peligros constantes, cazarrecompensas rivales y decisiones morales difíciles. En su viaje, aprenderá sobre la paternidad, el sacrificio y que incluso el guerrero más curtido puede encontrar un propósito mayor que él mismo.",
    poster:
      "https://images.pexels.com/photos/32671609/pexels-photo-32671609.jpeg",
  },
};

// Película por defecto para IDs que no existen en mockMoviesData
const getDefaultMovie = (id: string): Movie => ({
  id: id,
  titulo: "Película de Ejemplo",
  director: "Sofia Coppola",
  duracion: 120,
  año: 2023,
  genero: ["Drama", "Acción", "Aventura"],
  clasificacion: "13+",
  disponibilidad: "Disponible",
  actores: ["Actor Principal 1", "Actor Principal 2", "Actor Principal 3"],
  sinopsis:
    "Una conmovedora historia sobre una familia que se enfrenta ante la adversidad más desafiante de sus vidas. Cuando circunstancias inesperadas los obligan a abandonar su hogar y todo lo que conocen, deben encontrar la fuerza interior y el coraje para sobrevivir en un lugar completamente desconocido y hostil. A través de pruebas que ponen a prueba sus límites físicos y emocionales, descubren que el verdadero significado de la familia va más allá de los lazos de sangre. En medio del caos y la incertidumbre, encuentran aliados inesperados y aprenden lecciones valiosas sobre la resiliencia, el perdón y el poder transformador del amor incondicional. Esta es una película profundamente emotiva sobre las familias, la esperanza inquebrantable en tiempos difíciles, y la capacidad del espíritu humano para superar incluso las circunstancias más devastadoras. Con actuaciones magistrales y una cinematografía impresionante, esta obra maestra del cine contemporáneo nos recuerda que incluso en la oscuridad más profunda, siempre hay una luz de esperanza esperando ser descubierta.",
  poster: "https://images.pexels.com/photos/2752777/pexels-photo-2752777.jpeg",
});

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "comments">("info");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  // Obtener los datos de la película (mock data por ahora)
  // Si el ID existe en mockMoviesData, usar esos datos, sino usar película por defecto
  const movie: Movie =
    id && mockMoviesData[id]
      ? mockMoviesData[id]
      : getDefaultMovie(id || "default");

  const handleBack = () => {
    navigate(-1);
  };

  const handleWatch = () => {
    // TODO: Implementar lógica para reproducir la película
    console.log("Reproducir película:", movie.titulo);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    } catch (error) {
      console.log("Error copiando al portapapeles:", error);
      // Fallback para navegadores antiguos
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("¡Enlace copiado al portapapeles!");
      } catch {
        alert("No se pudo copiar el enlace");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleTabChange = (tab: "info" | "comments") => {
    setActiveTab(tab);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleRatingHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="movie-detail">
      {/* Header con imagen de fondo */}
      <div
        className="movie-detail__header"
        style={{ backgroundImage: `url(${movie.poster})` }}
        role="img"
        aria-label={`Imagen de fondo de ${movie.titulo}`}
      >
        <div className="movie-detail__header-overlay">
          <button
            className="movie-detail__back-button"
            onClick={handleBack}
            aria-label="Regresar a la página anterior"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Regresar
          </button>

          <button
            className="movie-detail__share-button"
            onClick={handleShare}
            aria-label="Copiar enlace de la película"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6897C16.4231 14.4391 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33401 21.9434 7.02303C21.932 5.71204 21.4061 4.45797 20.4791 3.53091C19.552 2.60386 18.298 2.07802 16.987 2.06663C15.676 2.05523 14.413 2.55921 13.47 3.47L11.75 5.18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11C13.5705 10.4259 13.0226 9.95084 12.3934 9.60707C11.7643 9.26331 11.0685 9.05889 10.3533 9.00768C9.63819 8.95646 8.92037 9.05964 8.24861 9.31029C7.57685 9.56094 6.96689 9.95303 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.542 3.52088 20.4691C4.44793 21.3961 5.702 21.922 7.01299 21.9334C8.32397 21.9448 9.58696 21.4408 10.53 20.53L12.24 18.82"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="movie-detail__title-section">
            <h1 className="movie-detail__title">{movie.titulo}</h1>
            <div className="movie-detail__metadata">
              <span
                className="movie-detail__year"
                aria-label={`Año ${movie.año}`}
              >
                {movie.año}
              </span>
              <span className="movie-detail__dot" aria-hidden="true">
                •
              </span>
              <span
                className="movie-detail__duration"
                aria-label={`Duración ${movie.duracion} minutos`}
              >
                {movie.duracion} min
              </span>
              <span className="movie-detail__dot" aria-hidden="true">
                •
              </span>
              <span
                className="movie-detail__classification"
                aria-label={`Clasificación ${movie.clasificacion}`}
              >
                {movie.clasificacion}
              </span>
            </div>
            <div className="movie-detail__genres" role="list">
              {movie.genero.map((genre: string, index: number) => (
                <span
                  key={index}
                  className="movie-detail__genre"
                  role="listitem"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Botones de acción dentro del overlay */}
            <div className="movie-detail__actions">
              <button
                className="movie-detail__action-button movie-detail__action-button--primary"
                onClick={handleWatch}
                aria-label={`Ver ${movie.titulo}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3L19 12L5 21V3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ver
              </button>

              <button
                className={`movie-detail__action-button movie-detail__action-button--secondary ${
                  isFavorite ? "movie-detail__action-button--active" : ""
                }`}
                onClick={handleToggleFavorite}
                aria-label={
                  isFavorite
                    ? `Quitar ${movie.titulo} de favoritos`
                    : `Añadir ${movie.titulo} a favoritos`
                }
                aria-pressed={isFavorite}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20.84 4.61C20.3292 4.09913 19.7228 3.69374 19.0554 3.41731C18.3879 3.14088 17.6725 2.99878 16.95 2.99878C16.2275 2.99878 15.5121 3.14088 14.8446 3.41731C14.1772 3.69374 13.5708 4.09913 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3509 11.8792 21.7563 11.2728 22.0327 10.6054C22.3091 9.93789 22.4512 9.22248 22.4512 8.5C22.4512 7.77752 22.3091 7.06211 22.0327 6.39464C21.7563 5.72718 21.3509 5.12075 20.84 4.61Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isFavorite ? "En Favoritos" : "Añadir a Favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="movie-detail__content">
        {/* Pestañas de navegación */}
        <div className="movie-detail__tabs">
          <button
            className={`movie-detail__tab ${
              activeTab === "info" ? "movie-detail__tab--active" : ""
            }`}
            onClick={() => handleTabChange("info")}
            aria-label="Ver información de la película"
            aria-pressed={activeTab === "info"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 16V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Más Información
          </button>

          <button
            className={`movie-detail__tab ${
              activeTab === "comments" ? "movie-detail__tab--active" : ""
            }`}
            onClick={() => handleTabChange("comments")}
            aria-label="Ver comentarios"
            aria-pressed={activeTab === "comments"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Comentarios
          </button>
        </div>

        {/* Contenido de la pestaña de información */}
        {activeTab === "info" && (
          <div className="movie-detail__tab-content">
            <section
              className="movie-detail__info-section"
              aria-labelledby="sinopsis-title"
            >
              <h2 id="sinopsis-title" className="movie-detail__section-title">
                Sinopsis
              </h2>
              <p className="movie-detail__sinopsis">{movie.sinopsis}</p>
            </section>

            <section
              className="movie-detail__info-section"
              aria-labelledby="info-title"
            >
              <h2 id="info-title" className="movie-detail__section-title">
                Información
              </h2>
              <div className="movie-detail__info-grid">
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Director:</span>
                  <span className="movie-detail__info-value">
                    {movie.director}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">
                    Fecha de estreno:
                  </span>
                  <span className="movie-detail__info-value">
                    8 de septiembre, {movie.año}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">
                    Disponibilidad:
                  </span>
                  <span className="movie-detail__info-value movie-detail__info-value--available">
                    {movie.disponibilidad}
                  </span>
                </div>
                <div className="movie-detail__info-item">
                  <span className="movie-detail__info-label">Actores:</span>
                  <span className="movie-detail__info-value">
                    {movie.actores.join(", ")}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Contenido de la pestaña de comentarios */}
        {activeTab === "comments" && (
          <div className="movie-detail__tab-content">
            <section
              className="movie-detail__comments-section"
              aria-labelledby="comments-title"
            >
              <h2 id="comments-title" className="movie-detail__section-title">
                Deja tu comentario
              </h2>

              {/* Formulario de nuevo comentario */}
              <div className="movie-detail__comment-form">
                <div className="movie-detail__rating-container">
                  <label className="movie-detail__rating-label">
                    Califica esta película:
                  </label>
                  <div
                    className="movie-detail__stars"
                    onMouseLeave={handleRatingLeave}
                    role="radiogroup"
                    aria-label="Calificación de 1 a 5 estrellas"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`movie-detail__star ${
                          star <= (hoverRating || selectedRating)
                            ? "movie-detail__star--filled"
                            : ""
                        }`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        aria-label={`${star} ${
                          star === 1 ? "estrella" : "estrellas"
                        }`}
                        role="radio"
                        aria-checked={selectedRating === star}
                        type="button"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {selectedRating > 0 && (
                    <span className="movie-detail__rating-text">
                      {selectedRating} de 5 estrellas
                    </span>
                  )}
                </div>

                <div className="movie-detail__textarea-container">
                  <label
                    htmlFor="comment-textarea"
                    className="movie-detail__textarea-label"
                  >
                    Tu comentario:
                  </label>
                  <textarea
                    id="comment-textarea"
                    className="movie-detail__textarea"
                    placeholder="Escribe tu opinión sobre esta película..."
                    rows={5}
                    aria-label="Escribe tu comentario sobre la película"
                  />
                </div>

                <button
                  className="movie-detail__submit-button"
                  type="button"
                  aria-label="Enviar comentario"
                >
                  Publicar Comentario
                </button>
              </div>

              {/* Mensaje de que no hay comentarios aún */}
              <div className="movie-detail__no-comments">
                <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
