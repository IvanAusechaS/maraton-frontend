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
    const { password, confirmPassword } = formData;

    // Validar longitud mínima
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    // Validar que contenga al menos un número
    if (!/\d/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número");
      return false;
    }

    // Validar que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra mayúscula");
      return false;
    }

    // Validar que contenga al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un carácter especial");
      return false;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
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
                minLength={8}
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
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10.5 10.5C10.0353 10.9532 9.75 11.5735 9.75 12.25C9.75 13.6307 10.8693 14.75 12.25 14.75C12.9265 14.75 13.5468 14.4647 14 14" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 6.5C4.5 8 2 12 2 12C2 12 5.63636 19 12 19C13.5 19 14.8 18.5 16 17.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17.5C19.5 16 22 12 22 12C22 12 18.3636 5 12 5C10.5 5 9.2 5.5 8 6.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
                minLength={8}
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
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10.5 10.5C10.0353 10.9532 9.75 11.5735 9.75 12.25C9.75 13.6307 10.8693 14.75 12.25 14.75C12.9265 14.75 13.5468 14.4647 14 14" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 6.5C4.5 8 2 12 2 12C2 12 5.63636 19 12 19C13.5 19 14.8 18.5 16 17.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17.5C19.5 16 22 12 22 12C22 12 18.3636 5 12 5C10.5 5 9.2 5.5 8 6.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
                    formData.password.length >= 8 ? "valid" : ""
                  }
                >
                  Al menos 8 caracteres
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "valid" : ""
                  }
                >
                  Al menos una letra mayúscula
                </li>
                <li
                  className={
                    /\d/.test(formData.password) ? "valid" : ""
                  }
                >
                  Al menos un número
                </li>
                <li
                  className={
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? "valid" : ""
                  }
                >
                  Al menos un carácter especial (!@#$%^&*)
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
