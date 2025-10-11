import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import MoviePage from "../pages/movie/MoviePage";
import Carousel from "../pages/home/components/carousel/Carousel";
import LayoutMARATON from "../layout/LayoutMARATON";
import SignUp from "../pages/auth/signup/SignupPage";
import LoginPage from "../pages/auth/login/LoginPage";

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
          <Route path="/peliculas" element={<MoviePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/registro" element={<SignUp />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </LayoutMARATON>
    </BrowserRouter>
  );
};

export default RoutesMARATON;
