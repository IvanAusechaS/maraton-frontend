import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import MoviePage from "../pages/movie/MoviePage";
import FavoritesPage from "../pages/favorites/FavoritesPage";
import MovieDetailPage from "../pages/movie-detail/MovieDetailPage";
import MoviePlayerPage from "../pages/movie-player/MoviePlayerPage";
import Carousel from "../pages/home/components/carousel/Carousel";
import LayoutMARATON from "../layout/LayoutMARATON";
import SignUp from "../pages/auth/signup/SignupPage";
import LoginPage from "../pages/auth/login/LoginPage";
import RecoveryPage from "../pages/auth/recovery/RecoveryPage";
import ResetPassPage from "../pages/auth/reset-pass/ResetPassPage";
import SuccessEmailPage from "../pages/auth/success-email/SucessEmailPage";
import ProfilePage from "../pages/profile/profile/ProfilePage";
import EditProfilePage from "../pages/profile/edit-profile/EditProfilePage";
import NotFoundPage from "../pages/not-found/NotFoundPage";

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
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/pelicula/:id" element={<MovieDetailPage />} />
          <Route path="/pelicula/:id/player" element={<MoviePlayerPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/registro" element={<SignUp />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar" element={<RecoveryPage />} />
          <Route path="/restablecer" element={<ResetPassPage />} />
          <Route path="/exito" element={<SuccessEmailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LayoutMARATON>
    </BrowserRouter>
  );
};

export default RoutesMARATON;
