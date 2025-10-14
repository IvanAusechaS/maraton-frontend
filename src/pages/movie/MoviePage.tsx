import { type FC, useState, useEffect } from "react";
import "./MoviePage.scss";
import {
  searchVideos,
  getPopularVideos,
  type PexelsVideo,
} from "../../services/movieService";

interface VideoCategory {
  title: string;
  videos: PexelsVideo[];
  loading: boolean;
}

const MoviePage: FC = () => {
  const [categories, setCategories] = useState<{
    [key: string]: VideoCategory;
  }>({
    trending: { title: "Tendencias", videos: [], loading: true },
    horror: { title: "Horror", videos: [], loading: true },
    superheroes: { title: "Superhéroes", videos: [], loading: true },
    romance: { title: "Romance", videos: [], loading: true },
    family: { title: "Familiar", videos: [], loading: true },
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Tendencias
        const trendingData = await getPopularVideos(1, 15);
        setCategories((prev) => ({
          ...prev,
          trending: {
            ...prev.trending,
            videos: trendingData.videos,
            loading: false,
          },
        }));

        // Horror
        const horrorData = await searchVideos("horror", 1, 15);
        setCategories((prev) => ({
          ...prev,
          horror: { ...prev.horror, videos: horrorData.videos, loading: false },
        }));

        // Superhéroes
        const superheroesData = await searchVideos("superheroes", 1, 15);
        setCategories((prev) => ({
          ...prev,
          superheroes: {
            ...prev.superheroes,
            videos: superheroesData.videos,
            loading: false,
          },
        }));

        // Romance
        const romanceData = await searchVideos("romance", 1, 15);
        setCategories((prev) => ({
          ...prev,
          romance: {
            ...prev.romance,
            videos: romanceData.videos,
            loading: false,
          },
        }));

        // Familiar
        const familyData = await searchVideos("family", 1, 15);
        setCategories((prev) => ({
          ...prev,
          family: { ...prev.family, videos: familyData.videos, loading: false },
        }));
      } catch (error) {
        console.error("Error loading videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="movie-page">
      <div className="movie-page__container">
        {Object.entries(categories).map(([key, category]) => (
          <VideoRow
            key={key}
            title={category.title}
            videos={category.videos}
            loading={category.loading}
          />
        ))}
      </div>
    </div>
  );
};

interface VideoRowProps {
  title: string;
  videos: PexelsVideo[];
  loading: boolean;
}

const VideoRow: FC<VideoRowProps> = ({ title, videos, loading }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById(`video-row-${title}`);
    if (!container) return;

    const scrollAmount = direction === "left" ? -250 : 250;
    const newPosition = scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);

    // Update arrow visibility
    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }, 300);
  };

  useEffect(() => {
    const container = document.getElementById(`video-row-${title}`);
    if (container) {
      setCanScrollRight(container.scrollWidth > container.clientWidth);
    }
  }, [videos, title]);

  if (loading) {
    return (
      <div className="video-row">
        <h2 className="video-row__title">{title}</h2>
        <div className="video-row__loading">Cargando videos...</div>
      </div>
    );
  }

  return (
    <div className="video-row">
      <h2 className="video-row__title">{title}</h2>
      <div className="video-row__wrapper">
        {canScrollLeft && (
          <button
            className="video-row__arrow video-row__arrow--left"
            onClick={() => handleScroll("left")}
          >
            <img src="/arrow-white.svg" alt="Previous" />
          </button>
        )}

        <div className="video-row__container" id={`video-row-${title}`}>
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-card__image">
                <img src={video.image} alt={`Video ${video.id}`} />
                <div className="video-card__overlay">
                  <button className="video-card__play">▶</button>
                </div>
              </div>
              <div className="video-card__info">
                <span className="video-card__duration">
                  {Math.floor(video.duration / 60)}:
                  {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            className="video-row__arrow video-row__arrow--right"
            onClick={() => handleScroll("right")}
          >
            <img src="/arrow-white.svg" alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
