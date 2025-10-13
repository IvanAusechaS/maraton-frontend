import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassPage.scss";
import mainLogo from "../../../../public/main-logo.svg";

/**
 * Reset password page component
 * @component
 * @returns {JSX.Element} The reset password page
 */
const ResetPassPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Obtener el token de los parámetros de la URL
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      // Si no hay token, redirigir a recuperar contraseña
      console.error("No token provided");
      navigate("/recuperar");
    } else {
      setToken(urlToken);
    }
  }, [searchParams, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores al escribir
    if (passwordError) {
      setPasswordError("");
    }
  };

  const validatePassword = (): boolean => {
    // Validar longitud mínima
    if (formData.password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement password reset logic with API
      console.log("Reset password attempt:", {
        token,
        password: formData.password,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirigir a login con mensaje de éxito
      navigate("/login", {
        state: { message: "Contraseña restablecida exitosamente" },
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      setPasswordError(
        "Hubo un error al restablecer la contraseña. Por favor, intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-pass-page">
      <div className="reset-pass-page__container">
        <div className="reset-pass-page__card">
          <button
            className="reset-pass-page__back"
            onClick={() => navigate("/")}
          >
            ← Regresar al inicio
          </button>

          <div className="reset-pass-page__logo">
            <img src={mainLogo} alt="Maraton Logo" />
          </div>

          <h1 className="reset-pass-page__title">Restablecer contraseña</h1>
          <p className="reset-pass-page__subtitle">
            Ingresa tu nueva contraseña
          </p>

          <form className="reset-pass-page__form" onSubmit={handleSubmit}>
            <div className="reset-pass-page__form-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="reset-pass-page__input"
                placeholder=" "
                required
                minLength={6}
              />
              <label htmlFor="password" className="reset-pass-page__label">
                Nueva contraseña
              </label>
              <button
                type="button"
                className="reset-pass-page__toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="reset-pass-page__form-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="reset-pass-page__input"
                placeholder=" "
                required
                minLength={6}
              />
              <label
                htmlFor="confirmPassword"
                className="reset-pass-page__label"
              >
                Confirmar contraseña
              </label>
              <button
                type="button"
                className="reset-pass-page__toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {passwordError && (
              <div className="reset-pass-page__error">{passwordError}</div>
            )}

            <div className="reset-pass-page__requirements">
              <p>La contraseña debe tener:</p>
              <ul>
                <li
                  className={
                    formData.password.length >= 6 ? "valid" : ""
                  }
                >
                  Al menos 6 caracteres
                </li>
                <li
                  className={
                    formData.password === formData.confirmPassword &&
                    formData.password.length > 0
                      ? "valid"
                      : ""
                  }
                >
                  Contraseñas coincidentes
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="reset-pass-page__submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "RESTABLECIENDO..."
                : "RESTABLECER CONTRASEÑA"}
            </button>

            <div className="reset-pass-page__login">
              <span>¿Recordaste tu contraseña? </span>
              <button
                type="button"
                className="reset-pass-page__login-link"
                onClick={() => navigate("/login")}
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassPage;
