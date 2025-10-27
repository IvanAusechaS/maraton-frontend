import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MoviePlayer.scss";
import { getMovieById } from "../../services/movieService";

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
  id: number;
  titulo: string;
  videoUrl: string;
}

/**
 * Checks if a URL is a YouTube video link
 */
const isYouTubeUrl = (url: string): boolean => {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  );
};

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
const getYouTubeVideoId = (url: string): string | null => {
  // Handle youtu.be format
  if (url.includes("youtu.be/")) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }

  // Handle youtube.com format
  if (url.includes("youtube.com")) {
    // Try to get from v parameter
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    if (videoId) return videoId;

    // Try to get from embed URL
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    return embedMatch ? embedMatch[1] : null;
  }

  return null;
};

/**
 * Converts a YouTube URL to an embeddable format with parameters for API control
 */
const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  // Enable JS API, hide controls, allow autoplay
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=1&playsinline=1`;
};

const MoviePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null); // YouTube Player instance
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState<string | null>(null);

  // Fetch movie data from backend
  useEffect(() => {
    if (!id) {
      setError("No movie ID provided");
      setIsLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movieData = await getMovieById(parseInt(id));

        const videoUrl = movieData.largometraje;

        // Check if it's a YouTube video
        if (isYouTubeUrl(videoUrl)) {
          const embedUrl = getYouTubeEmbedUrl(videoUrl);
          if (embedUrl) {
            setIsYouTube(true);
            setYoutubeEmbedUrl(embedUrl);
          } else {
            setError("Invalid YouTube URL");
            setIsLoading(false);
            return;
          }
        } else {
          setIsYouTube(false);
          setYoutubeEmbedUrl(null);
        }

        setMovie({
          id: movieData.id,
          titulo: movieData.titulo,
          videoUrl: videoUrl,
        });
      } catch (err) {
        console.error("Error loading movie:", err);
        setError("Failed to load movie. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Time update for YouTube
  const timeUpdateInterval = useRef<number | null>(null);

  const startTimeUpdate = useCallback(() => {
    if (timeUpdateInterval.current) return;

    timeUpdateInterval.current = window.setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
        try {
          const current = youtubePlayerRef.current.getCurrentTime();
          setCurrentTime(current);
        } catch (error) {
          console.error("Error getting current time:", error);
        }
      }
    }, 100);
  }, []);

  const stopTimeUpdate = useCallback(() => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  }, []);

  // ✅ Función para ocultar overlays de YouTube usando CSS agresivo
  const hideYouTubeOverlays = useCallback(() => {
    // Inyectar CSS para ocultar todos los overlays de YouTube
    const styleId = "youtube-overlay-hider";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* Ocultar TODOS los overlays de YouTube */
        .ytp-pause-overlay,
        .ytp-scroll-min,
        .ytp-chrome-top,
        .ytp-show-cards-title,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-ce-element,
        .ytp-cards-teaser,
        .ytp-suggested-action,
        .ytp-endscreen-content,
        .ytp-watermark,
        .ytp-paid-content-overlay,
        .iv-branding,
        .ytp-title-text,
        .ytp-share-button-visible,
        .ytp-watch-later-button,
        .ytp-share-button {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        
        /* Asegurar que el iframe ocupe todo el espacio */
        #youtube-player {
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Initialize YouTube Player
  const initializeYouTubePlayer = useCallback(
    (videoId: string) => {
      if (!youtubeContainerRef.current) return;

      try {
        youtubePlayerRef.current = new (window as any).YT.Player(
          "youtube-player",
          {
            videoId: videoId,
            playerVars: {
              autoplay: 0, // No auto-reproducir
              controls: 0, // ✅ Ocultar TODOS los controles de YouTube
              modestbranding: 1, // ✅ Ocultar logo grande de YouTube
              showinfo: 0, // ✅ Ocultar título y canal
              rel: 0, // ✅ No mostrar videos relacionados al final
              disablekb: 1, // ✅ Desactivar atajos de teclado de YouTube
              autohide: 1, // ✅ Auto-ocultar controles (navegadores antiguos)
              fs: 0, // ❌ Desactivar fullscreen nativo de YouTube
              playsinline: 1, // Reproducir inline en móviles
              enablejsapi: 1, // Habilitar API de JavaScript
              iv_load_policy: 3, // Ocultar anotaciones
              cc_load_policy: 0, // ✅ Desactivar subtítulos por defecto
              origin: window.location.origin, // ✅ Mejor seguridad y rendimiento
            },
            events: {
              onReady: (event: any) => {
                console.log("✅ YouTube player ready");
                // Set initial volume
                event.target.setVolume(volume * 100);
                setDuration(event.target.getDuration());

                // ✅ Forzar ocultamiento de overlays al estar listo
                hideYouTubeOverlays();
              },
              onStateChange: (event: any) => {
                const playerState = event.data;
                // YT.PlayerState: UNSTARTED = -1, ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
                if (playerState === 1) {
                  setIsPlaying(true);
                  startTimeUpdate();
                  hideYouTubeOverlays(); // ✅ Ocultar overlays al reproducir
                } else if (playerState === 2 || playerState === 0) {
                  setIsPlaying(false);
                  stopTimeUpdate();
                  hideYouTubeOverlays(); // ✅ Ocultar overlays al pausar
                }
              },
              onError: (event: any) => {
                console.error("❌ YouTube player error:", event.data);
                setError("Error al cargar el video de YouTube");
              },
            },
          }
        );
      } catch (error) {
        console.error("Error initializing YouTube player:", error);
        setError("Error al inicializar el reproductor de YouTube");
      }
    },
    [volume, startTimeUpdate, stopTimeUpdate, hideYouTubeOverlays]
  );

  // ✅ Aplicar CSS para ocultar overlays al montar el componente
  useEffect(() => {
    if (isYouTube) {
      hideYouTubeOverlays();
    }
  }, [isYouTube, hideYouTubeOverlays]);

  // Load YouTube API and initialize player when needed
  useEffect(() => {
    if (!isYouTube || !youtubeEmbedUrl || !movie) return;

    const videoId = getYouTubeVideoId(movie.videoUrl);
    if (!videoId) return;

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      initializeYouTubePlayer(videoId);
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      initializeYouTubePlayer(videoId);
    };

    return () => {
      // Cleanup YouTube player
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying YouTube player:", error);
        }
        youtubePlayerRef.current = null;
      }
    };
  }, [isYouTube, youtubeEmbedUrl, movie, initializeYouTubePlayer]);

  // Play/Pause toggle - Modified to work with both video types
  const togglePlay = useCallback(() => {
    if (isYouTube && youtubePlayerRef.current) {
      try {
        const playerState = youtubePlayerRef.current.getPlayerState();
        // YT.PlayerState: PLAYING = 1, PAUSED = 2
        if (playerState === 1) {
          youtubePlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          youtubePlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error toggling YouTube playback:", error);
      }
    } else if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isYouTube]);

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);

    if (isYouTube && youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.setVolume(vol * 100);
        setVolume(vol);
        setIsMuted(vol === 0);
      } catch (error) {
        console.error("Error setting YouTube volume:", error);
      }
    } else if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isYouTube && youtubePlayerRef.current) {
      try {
        if (isMuted) {
          youtubePlayerRef.current.unMute();
          if (volume === 0) {
            youtubePlayerRef.current.setVolume(50);
            setVolume(0.5);
          }
          setIsMuted(false);
        } else {
          youtubePlayerRef.current.mute();
          setIsMuted(true);
        }
      } catch (error) {
        console.error("Error toggling YouTube mute:", error);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted, isYouTube, volume]);

  // Toggle volume slider visibility
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  // Skip forward/backward - Modified to work with both video types
  const skip = useCallback(
    (seconds: number) => {
      if (isYouTube && youtubePlayerRef.current) {
        try {
          const currentTime = youtubePlayerRef.current.getCurrentTime();
          const duration = youtubePlayerRef.current.getDuration();
          const newTime = Math.max(
            0,
            Math.min(currentTime + seconds, duration)
          );
          youtubePlayerRef.current.seekTo(newTime, true);
        } catch (error) {
          console.error("Error seeking YouTube video:", error);
        }
      } else if (videoRef.current && videoRef.current.duration) {
        const newTime = videoRef.current.currentTime + seconds;
        videoRef.current.currentTime = Math.max(
          0,
          Math.min(newTime, videoRef.current.duration)
        );
      }
    },
    [isYouTube]
  );

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

    const handlePlay = () => {
      console.log("Video play event");
      setIsPlaying(true);
      // Ocultar controles después de 3 segundos cuando está reproduciendo
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };
    const handlePause = () => {
      console.log("Video pause event");
      setIsPlaying(false);
      setShowControls(true);
    };
    const handlePlaying = () => {
      console.log("Video playing event");
      setIsPlaying(true);
    };
    const handleWaiting = () => {
      console.log("Video waiting event");
      setIsPlaying(false);
    };
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded, duration:", video.duration);
      setDuration(video.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
          skip(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(5);
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
  }, [isPlaying, isMuted, showSubtitlesMenu, togglePlay, toggleMute, skip]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="movie-player movie-player--loading">
        <div className="movie-player__loading">
          <div className="movie-player__spinner"></div>
          <p className="movie-player__loading-text">Cargando video...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !movie) {
    return (
      <div className="movie-player movie-player--loading">
        <div className="movie-player__loading">
          <p className="movie-player__loading-text" style={{ color: "red" }}>
            {error || "No se pudo cargar el video"}
          </p>
          <button
            className="btn btn--primary"
            onClick={() => navigate(-1)}
            style={{ marginTop: "1rem" }}
          >
            Volver
          </button>
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
      {/* Video Element - YouTube iframe or HTML5 video */}
      {isYouTube && youtubeEmbedUrl ? (
        <div
          ref={youtubeContainerRef}
          id="youtube-player"
          className="movie-player__video"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          className="movie-player__video"
          src={movie.videoUrl}
          onClick={togglePlay}
        />
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

        {/* Center Skip Controls - Dentro del contenedor de controles */}
        <div className="movie-player__center-controls">
          <button
            className="movie-player__skip-button movie-player__skip-button--backward"
            onClick={() => skip(-5)}
            aria-label="Retroceder 5 segundos"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
            <span className="movie-player__skip-label">5</span>
          </button>

          {/* Center Play Button */}
          <button
            className="movie-player__center-play-button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            className="movie-player__skip-button movie-player__skip-button--forward"
            onClick={() => skip(5)}
            aria-label="Adelantar 5 segundos"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
            </svg>
            <span className="movie-player__skip-label">5</span>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="movie-player__bottom-controls">
          {/* Controls Row */}
          <div className="movie-player__controls-row">
            {/* Time Display */}
            <span className="movie-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Right Controls */}
            <div className="movie-player__controls-right">
              {/* Volume Control */}
              <div className="movie-player__volume-container">
                <button
                  className="movie-player__volume-button"
                  onClick={toggleVolumeSlider}
                  aria-label="Control de volumen"
                  aria-expanded={showVolumeSlider}
                >
                  {isMuted || volume === 0 ? (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    </svg>
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                {showVolumeSlider && (
                  <div className="movie-player__volume-slider-container">
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
                )}
              </div>

              <button
                className="movie-player__control-button-simple"
                onClick={() => setShowSubtitlesMenu(!showSubtitlesMenu)}
                aria-label="Subtítulos"
                aria-expanded={showSubtitlesMenu}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
                </svg>
              </button>

              <button
                className="movie-player__control-button-simple"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
              >
                {isFullscreen ? (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg
                    width="32"
                    height="32"
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
