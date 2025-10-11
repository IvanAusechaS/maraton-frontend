import { useState, useEffect } from 'react';
import './Carousel.scss';

interface MovieSlide {
  id: number;
  title: string;
  imageUrl: string;
}

const movies: MovieSlide[] = [
  {
    id: 1,
    title: "Stranger Things",
    imageUrl: "https://images.pexels.com/photos/2752777/pexels-photo-2752777.jpeg"
  },
  {
    id: 2,
    title: "Star Wars: A New Hope",
    imageUrl: "https://images.pexels.com/photos/28310406/pexels-photo-28310406.jpeg"
  },
  {
    id: 3,
    title: "The Mandalorian",
    imageUrl: "https://images.pexels.com/photos/32671609/pexels-photo-32671609.jpeg"
  },
  {
    id: 4,
    title: "A Horror Story",
    imageUrl: "https://images.pexels.com/photos/19057445/pexels-photo-19057445.jpeg"
  },
  {
    id: 5,
    title: "Classic Romance",
    imageUrl: "https://images.pexels.com/photos/7299484/pexels-photo-7299484.jpeg"
  },
  {
    id: 6,
    title: "Harry Potter",
    imageUrl: "https://images.pexels.com/photos/4488194/pexels-photo-4488194.jpeg"
  },
  {
    id: 7,
    title: "Sherlock Holmes",
    imageUrl: "https://images.pexels.com/photos/7319084/pexels-photo-7319084.jpeg"
  },
  {
    id: 8,
    title: "True Detective",
    imageUrl: "https://images.pexels.com/photos/7299456/pexels-photo-7299456.jpeg"
  }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getSlideClassName = (index: number) => {
    const distance = Math.abs(currentIndex - index);
    
    if (distance === 0) return 'slide active';
    if (distance === 1 || (currentIndex === 0 && index === movies.length - 1) || (currentIndex === movies.length - 1 && index === 0)) return 'slide adjacent';
    return 'slide';
  };

  return (
    <section className="carousel-section">
      <h2 className="carousel-section__title">El mejor contenido en tendencia</h2>
      
      <div className="carousel">
        <button className="carousel__arrow carousel__arrow--left" onClick={handlePrevious}>
          <img src="/arrow-white.svg" alt="Previous" />
        </button>

        <div className="carousel__container">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={getSlideClassName(index)}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                opacity: Math.abs(currentIndex - index) <= 2 ? 1 : 0,
                zIndex: index === currentIndex ? 2 : 1
              }}
            >
              <img src={movie.imageUrl} alt={movie.title} />
              {index === currentIndex && (
                <div className="slide__title">
                  <h3>{movie.title}</h3>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="carousel__arrow carousel__arrow--right" onClick={handleNext}>
          <img src="/arrow-white.svg" alt="Next" />
        </button>
      </div>
    </section>
  );
};

export default Carousel;