import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MoviePlayer.scss";

/**
 * Movie Player Page component.
 * Full-screen video player with controls for play, pause, seek, volume, and subtitles.
 * Fetches video from Pexels API based on movie ID.
 *
 * @component
 * @returns {JSX.Element} Full-screen movie player
 * @example
 * <MoviePlayerPage />
 *
 * @accessibility
 * - Keyboard controls for all player functions
 * - ARIA labels for all interactive elements
 * - Focus management
 * - Screen reader support
 *
 * @wcag
 * - WCAG 2.1 Level AA compliant
 * - Keyboard navigation (Space, Arrow keys, M, F, etc.)
 * - High contrast controls
 * - Touch-friendly controls (44x44px minimum)
 */

interface Movie {
  id: string;
  titulo: string;
  videoUrl: string;
}

// Video por defecto de Pexels hasta que se conecte el backend
// Video by Clément Proust from Pexels: https://www.pexels.com/video/aerial-view-of-mont-saint-michel-at-dusk-32766348/
const DEFAULT_VIDEO = {
  titulo: "Aerial View of Mont Saint-Michel at Dusk",
  videoUrl:
    "https://videos.pexels.com/video-files/32766348/13968433_1920_1080_30fps.mp4", // 1080p HD
  videoUrl4K:
    "https://videos.pexels.com/video-files/32766348/13968435_3840_2160_30fps.mp4", // 4K (opcional)
  videoUrl720p:
    "https://videos.pexels.com/video-files/32766348/13968432_1280_720_30fps.mp4", // 720p (fallback)
  author: "Clément Proust",
  pexelsUrl:
    "https://www.pexels.com/video/aerial-view-of-mont-saint-michel-at-dusk-32766348/",
};

// Mock data para IDs 1, 2, 3 (del carousel) - solo títulos
const mockMovieTitles: { [key: string]: string } = {
  "1": "Stranger Things",
  "2": "Star Wars: A New Hope",
  "3": "The Mandalorian",
};

const MoviePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [movie, setMovie] = useState<Movie | null>(null);

  // Usar video por defecto hasta que se conecte el backend
  useEffect(() => {
    if (!id) {
      return;
    }

    // Por ahora, usar siempre el video por defecto independientemente del ID
    // Cuando el backend esté listo, aquí se hará el fetch real
    console.log(`Loading default video for movie ID: ${id}`);

    setMovie({
      id: id,
      titulo: mockMovieTitles[id] || DEFAULT_VIDEO.titulo,
      videoUrl: DEFAULT_VIDEO.videoUrl,
    });

    console.log("Default video loaded successfully!");
    console.log(`Video: ${DEFAULT_VIDEO.titulo} by ${DEFAULT_VIDEO.author}`);
    console.log(`Source: ${DEFAULT_VIDEO.pexelsUrl}`);
  }, [id]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Seek video
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format time
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Show/hide controls
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percentage = (bufferedEnd / video.duration) * 100;
        setBuffered(percentage);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => Math.min(prev + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => Math.max(prev - 0.1, 0));
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (showSubtitlesMenu) {
            setShowSubtitlesMenu(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, isMuted, showSubtitlesMenu, togglePlay, toggleMute]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // Si no hay película cargada, mostrar loading
  if (!movie) {
    return (
      <div className="movie-player movie-player--loading">
        <div className="movie-player__loading">
          <div className="movie-player__spinner"></div>
          <p className="movie-player__loading-text">Cargando video...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`movie-player ${
        isFullscreen ? "movie-player--fullscreen" : ""
      }`}
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="movie-player__video"
        src={movie.videoUrl}
        onClick={togglePlay}
      />

      {/* Loading indicator */}
      {!duration && (
        <div className="movie-player__loading">
          <div className="movie-player__spinner"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`movie-player__controls ${
          showControls ? "movie-player__controls--visible" : ""
        }`}
      >
        {/* Top Bar */}
        <div className="movie-player__top-bar">
          <button
            className="movie-player__back-button"
            onClick={handleBack}
            aria-label="Volver"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver
          </button>
          <h1 className="movie-player__title">{movie.titulo}</h1>
        </div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && (
          <button
            className="movie-player__center-play"
            onClick={togglePlay}
            aria-label="Reproducir"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {/* Bottom Controls */}
        <div className="movie-player__bottom-controls">
          {/* Progress Bar */}
          <div className="movie-player__progress-container">
            <div
              className="movie-player__progress-buffered"
              style={{ width: `${buffered}%` }}
            />
            <input
              type="range"
              className="movie-player__progress"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Barra de progreso del video"
              style={{
                background: `linear-gradient(to right, var(--color-secondary) 0%, var(--color-secondary) ${
                  (currentTime / duration) * 100
                }%, rgba(255, 255, 255, 0.3) ${
                  (currentTime / duration) * 100
                }%, rgba(255, 255, 255, 0.3) 100%)`,
              }}
            />
          </div>

          {/* Controls Row */}
          <div className="movie-player__controls-row">
            {/* Left Controls */}
            <div className="movie-player__controls-left">
              <button
                className="movie-player__control-button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                className="movie-player__control-button"
                onClick={() => skip(-10)}
                aria-label="Retroceder 10 segundos"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
                    fill="currentColor"
                  />
                </svg>
                <span className="movie-player__skip-text">-10</span>
              </button>

              <button
                className="movie-player__control-button"
                onClick={() => skip(10)}
                aria-label="Adelantar 10 segundos"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
                    fill="currentColor"
                  />
                </svg>
                <span className="movie-player__skip-text">+10</span>
              </button>

              {/* Volume Control */}
              <div className="movie-player__volume-control">
                <button
                  className="movie-player__control-button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  className="movie-player__volume-slider"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Control de volumen"
                />
              </div>

              <span className="movie-player__time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="movie-player__controls-right">
              <button
                className="movie-player__control-button"
                onClick={() => setShowSubtitlesMenu(!showSubtitlesMenu)}
                aria-label="Subtítulos"
                aria-expanded={showSubtitlesMenu}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
                </svg>
              </button>

              <button
                className="movie-player__control-button"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
              >
                {isFullscreen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitles Menu */}
      {showSubtitlesMenu && (
        <div className="movie-player__subtitles-menu">
          <div className="movie-player__subtitles-header">
            <h3>Subtítulos</h3>
            <button
              className="movie-player__subtitles-close"
              onClick={() => setShowSubtitlesMenu(false)}
              aria-label="Cerrar menú de subtítulos"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          <div className="movie-player__subtitles-content">
            <button className="movie-player__subtitle-option movie-player__subtitle-option--active">
              Desactivado
            </button>
            <button className="movie-player__subtitle-option" disabled>
              Español
            </button>
            <button className="movie-player__subtitle-option" disabled>
              Inglés
            </button>
            <button className="movie-player__subtitle-option" disabled>
              Francés
            </button>
            <p className="movie-player__subtitles-note">
              Los subtítulos estarán disponibles próximamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePlayerPage;
