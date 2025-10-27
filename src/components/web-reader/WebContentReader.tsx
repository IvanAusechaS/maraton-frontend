/**
 * WebContentReader Component
 * 
 * Lector de contenido web accesible que cumple con WCAG 2.1 Level AA
 * 
 * Cumplimiento WCAG:
 * - 1.4.3 Contrast (AA): Ratios de contraste mínimo 4.5:1
 * - 2.1.1 Keyboard: Completamente navegable por teclado
 * - 2.4.7 Focus Visible: Indicadores de foco claros
 * - 3.2.4 Consistent Identification: Componentes consistentes
 * - 4.1.2 Name, Role, Value: ARIA attributes correctos
 * 
 * @author MARATON Team
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "./WebContentReader.scss";

// Tipos para TypeScript
interface ReaderPreferences {
  enabled: boolean;
  rate: number;
  pitch: number;
  voice: string;
}

const WebContentReader: React.FC = () => {
  // Estados principales
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1.0); // Velocidad de lectura (0.1 - 2.0)
  const [pitch, setPitch] = useState(1.0); // Tono de voz (0 - 2)
  const [notification, setNotification] = useState<string>("");
  
  // Referencias
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * WCAG 4.1.2 - Name, Role, Value
   * Carga las voces disponibles del navegador
   */
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Preferir voces en español
        const spanishVoice = availableVoices.find(
          (v) => v.lang.startsWith("es")
        );
        if (spanishVoice) {
          setSelectedVoice(spanishVoice.voiceURI);
        } else if (availableVoices[0]) {
          setSelectedVoice(availableVoices[0].voiceURI);
        }
      }
    };

    loadVoices();
    
    // Algunos navegadores cargan las voces de forma asíncrona
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Limpiar al desmontar
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * WCAG 3.2.4 - Consistent Identification
   * Cargar preferencias guardadas del usuario
   */
  useEffect(() => {
    const savedPrefs = localStorage.getItem("webReaderPreferences");
    if (savedPrefs) {
      try {
        const prefs: ReaderPreferences = JSON.parse(savedPrefs);
        setRate(prefs.rate);
        setPitch(prefs.pitch);
        if (prefs.voice) {
          setSelectedVoice(prefs.voice);
        }
      } catch (error) {
        console.error("Error loading reader preferences:", error);
      }
    }
  }, []);

  /**
   * Guardar preferencias en localStorage
   */
  const savePreferences = useCallback(() => {
    const prefs: ReaderPreferences = {
      enabled: isReading,
      rate,
      pitch,
      voice: selectedVoice,
    };
    localStorage.setItem("webReaderPreferences", JSON.stringify(prefs));
  }, [isReading, rate, pitch, selectedVoice]);

  /**
   * Mostrar notificación accesible
   * WCAG 4.1.3 - Status Messages
   */
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  /**
   * Obtener todo el texto visible del contenido principal
   * WCAG 1.3.1 - Info and Relationships
   * Solo lee contenido visible y semánticamente relevante
   */
  const getPageContent = (): string => {
    // Buscar el contenido principal (main, article, o role="main")
    const mainContent =
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('article') ||
      document.body;

    if (!mainContent) return "";

    // Clonar para no afectar el DOM original
    const clone = mainContent.cloneNode(true) as HTMLElement;

    // Remover elementos que no deben leerse
    const elementsToRemove = clone.querySelectorAll(
      'script, style, [aria-hidden="true"], .web-content-reader, nav, footer'
    );
    elementsToRemove.forEach((el) => el.remove());

    // Obtener texto visible
    let text = clone.innerText || clone.textContent || "";
    
    // Limpiar espacios múltiples y saltos de línea excesivos
    text = text.replace(/\s+/g, " ").trim();
    
    return text;
  };

  /**
   * Iniciar lectura del contenido
   * WCAG 2.1.1 - Keyboard
   */
  const startReading = () => {
    if (!window.speechSynthesis) {
      showNotification("Tu navegador no soporta lectura por voz");
      return;
    }

    // Cancelar cualquier lectura previa
    window.speechSynthesis.cancel();

    const content = getPageContent();
    
    if (!content) {
      showNotification("No hay contenido para leer");
      return;
    }

    // Crear nuevo utterance
    const utterance = new SpeechSynthesisUtterance(content);
    
    // Configurar voz seleccionada
    const voice = voices.find((v) => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Aplicar configuraciones
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = "es-ES";

    // Eventos para actualizar el estado
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
      showNotification("Lectura iniciada");
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      showNotification("Lectura finalizada");
    };

    utterance.onerror = (event) => {
      console.error("Error en lectura:", event);
      setIsReading(false);
      setIsPaused(false);
      showNotification("Error en la lectura");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    savePreferences();
  };

  /**
   * Pausar/Reanudar lectura
   * WCAG 2.2.2 - Pause, Stop, Hide
   */
  const togglePause = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      showNotification("Lectura reanudada");
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      showNotification("Lectura pausada");
    }
  };

  /**
   * Detener lectura
   * WCAG 2.2.2 - Pause, Stop, Hide
   */
  const stopReading = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    showNotification("Lectura detenida");
  };

  /**
   * Cambiar velocidad de lectura
   * WCAG 1.4.12 - Text Spacing (relacionado)
   */
  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    savePreferences();
    
    // Si está leyendo, reiniciar con nueva velocidad
    if (isReading && utteranceRef.current) {
      const wasReading = !isPaused;
      stopReading();
      if (wasReading) {
        setTimeout(startReading, 100);
      }
    }
  };

  /**
   * Cambiar voz
   * WCAG 3.1.2 - Language of Parts
   */
  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoice(voiceURI);
    savePreferences();
  };

  /**
   * Toggle del panel de controles
   * WCAG 2.4.7 - Focus Visible
   */
  const togglePanel = () => {
    setIsOpen(!isOpen);
    
    // Enfocar el primer elemento interactivo cuando se abre
    if (!isOpen) {
      setTimeout(() => {
        const firstButton = panelRef.current?.querySelector("button");
        firstButton?.focus();
      }, 100);
    }
  };

  /**
   * Cerrar panel con tecla Escape
   * WCAG 2.1.1 - Keyboard
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* 
        Botón flotante principal
        WCAG 2.4.7 - Focus Visible
        WCAG 4.1.2 - Name, Role, Value
      */}
      <button
        className="web-content-reader__fab"
        onClick={togglePanel}
        aria-label={isOpen ? "Cerrar panel de lectura" : "Abrir panel de lectura"}
        aria-expanded={isOpen}
        aria-controls="reader-panel"
        title="Lector de contenido web"
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="web-content-reader__icon"
        >
          {isReading ? (
            // Icono de ondas de sonido cuando está leyendo
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </>
          ) : (
            // Icono de accesibilidad/altavoz
            <>
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <circle cx="12" cy="12" r="10" />
            </>
          )}
        </svg>
        {isReading && (
          <span className="web-content-reader__pulse" aria-hidden="true"></span>
        )}
      </button>

      {/* 
        Panel de controles
        WCAG 1.3.1 - Info and Relationships
        WCAG 1.4.3 - Contrast (Minimum)
      */}
      {isOpen && (
        <div
          id="reader-panel"
          ref={panelRef}
          className="web-content-reader__panel"
          role="region"
          aria-label="Panel de controles del lector de contenido"
        >
          <div className="web-content-reader__header">
            <h2 className="web-content-reader__title">
              Lector de Contenido
            </h2>
            <button
              onClick={togglePanel}
              className="web-content-reader__close"
              aria-label="Cerrar panel"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="web-content-reader__controls">
            {/* Controles de reproducción */}
            <div className="web-content-reader__playback">
              <button
                onClick={startReading}
                disabled={isReading && !isPaused}
                className="web-content-reader__btn web-content-reader__btn--primary"
                aria-label="Iniciar lectura"
                title="Reproducir"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Reproducir
              </button>

              <button
                onClick={togglePause}
                disabled={!isReading}
                className="web-content-reader__btn"
                aria-label={isPaused ? "Reanudar lectura" : "Pausar lectura"}
                title={isPaused ? "Reanudar" : "Pausar"}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {isPaused ? (
                    <path d="M8 5v14l11-7z" />
                  ) : (
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  )}
                </svg>
                {isPaused ? "Reanudar" : "Pausar"}
              </button>

              <button
                onClick={stopReading}
                disabled={!isReading}
                className="web-content-reader__btn web-content-reader__btn--danger"
                aria-label="Detener lectura"
                title="Detener"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                Detener
              </button>
            </div>

            {/* Control de velocidad */}
            <div className="web-content-reader__setting">
              <label
                htmlFor="reader-rate"
                className="web-content-reader__label"
              >
                Velocidad: {rate.toFixed(1)}x
              </label>
              <input
                id="reader-rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="web-content-reader__slider"
                aria-valuemin={0.5}
                aria-valuemax={2}
                aria-valuenow={rate}
                aria-label="Ajustar velocidad de lectura"
              />
              <div className="web-content-reader__slider-labels">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Selector de voz */}
            <div className="web-content-reader__setting">
              <label
                htmlFor="reader-voice"
                className="web-content-reader__label"
              >
                Voz
              </label>
              <select
                id="reader-voice"
                value={selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="web-content-reader__select"
                aria-label="Seleccionar voz para lectura"
              >
                {voices.length === 0 ? (
                  <option>Cargando voces...</option>
                ) : (
                  voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Indicador de estado */}
            <div
              className="web-content-reader__status"
              role="status"
              aria-live="polite"
            >
              {isReading && !isPaused && (
                <div className="web-content-reader__status-indicator">
                  <span className="web-content-reader__status-dot" aria-hidden="true"></span>
                  Leyendo contenido...
                </div>
              )}
              {isPaused && (
                <div className="web-content-reader__status-indicator web-content-reader__status-indicator--paused">
                  <span className="web-content-reader__status-dot" aria-hidden="true"></span>
                  En pausa
                </div>
              )}
            </div>
          </div>

          {/* Información de ayuda */}
          <div className="web-content-reader__help">
            <p>
              <strong>Atajos de teclado:</strong>
            </p>
            <ul>
              <li>
                <kbd>Escape</kbd> - Cerrar panel
              </li>
              <li>
                <kbd>Tab</kbd> - Navegar controles
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 
        Notificaciones accesibles
        WCAG 4.1.3 - Status Messages
      */}
      {notification && (
        <div
          className="web-content-reader__notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {notification}
        </div>
      )}
    </>
  );
};

export default WebContentReader;
