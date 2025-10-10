import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
// import AboutPage from "../pages/about/AboutPage";
// import MoviePage from "../pages/movie/MoviePage";
import LayoutMARATON from "../layout/LayoutMARATON";

/**
 * Top-level route configuration for the MARATON app.
 *
 * @component
 * @returns {JSX.Element} Router with all application routes inside a shared layout.
 * @remarks
 * - Uses `BrowserRouter` for clean URLs (history API).
 * - Wraps pages with `LayoutMARATON` to provide global UI (Navbar/Footer).
 */
const RoutesMARATON = () => {
  return (
    <BrowserRouter>
      <LayoutMARATON>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/peliculas" element={<MoviePage />} /> */}
          {/* <Route path="/sobre-nosotros" element={<AboutPage />} /> */}
        </Routes>
      </LayoutMARATON>
    </BrowserRouter>
  );
};

export default RoutesMARATON;
