import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.scss";
import authService from "../../../services/authService";
import { ApiError } from "../../../services/api";

/**
 * Signup page component
 * @component
 * @returns {JSX.Element} The signup page
 */
const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fechaNacimiento: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar contraseña
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Combinar nombre y apellido en username
      const username = `${formData.nombre} ${formData.apellido}`.trim();

      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        username,
        birth_date: formData.fechaNacimiento,
      });

      console.log("Registro exitoso:", response);

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string } | undefined;
        setError(errorData?.message || "Error al crear la cuenta");
      } else {
        setError("Error de conexión. Por favor, intenta de nuevo.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page" role="main">
      <div className="signup-page__container">
        <div className="signup-page__card">
          <button
            className="signup-page__back"
            onClick={() => navigate("/")}
            aria-label="Regresar al inicio"
          >
            ← Regresar al inicio
          </button>
          <div className="signup-page__logo">
            <img
              src="/main-logo.svg"
              alt="Logotipo de Maraton - Plataforma de streaming"
            />
          </div>

          <h1 className="signup-page__title">Crea tu cuenta</h1>
          <p className="signup-page__subtitle">
            Únete a nuestra plataforma de contenido audiovisual
          </p>

          {error && (
            <div
              className="signup-page__error"
              role="alert"
              aria-live="assertive"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  display: "inline-block",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form
            className="signup-page__form"
            onSubmit={handleSubmit}
            aria-label="Formulario de registro"
            noValidate
          >
            <div className="signup-page__form-group">
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                aria-required="true"
                autoComplete="given-name"
              />
              <label htmlFor="nombre" className="signup-page__label">
                Nombre
              </label>
            </div>

            <div className="signup-page__form-group">
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                aria-required="true"
                autoComplete="family-name"
              />
              <label htmlFor="apellido" className="signup-page__label">
                Apellido
              </label>
            </div>

            <div className="signup-page__form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                autoComplete="email"
              />
              <label htmlFor="email" className="signup-page__label">
                Correo electrónico
              </label>
            </div>

            <div className="signup-page__form-group">
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                aria-required="true"
                autoComplete="bday"
                aria-label="Fecha de nacimiento en formato día, mes, año"
              />
              <label htmlFor="fechaNacimiento" className="signup-page__label">
                Fecha de Nacimiento
              </label>
            </div>

            <div className="signup-page__form-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                minLength={8}
                aria-required="true"
                aria-describedby="password-requirements"
                autoComplete="new-password"
              />
              <label htmlFor="password" className="signup-page__label">
                Contraseña
              </label>
              <button
                type="button"
                className="signup-page__toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                tabIndex={0}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 10.5C10.0353 10.9532 9.75 11.5735 9.75 12.25C9.75 13.6307 10.8693 14.75 12.25 14.75C12.9265 14.75 13.5468 14.4647 14 14"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 6.5C4.5 8 2 12 2 12C2 12 5.63636 19 12 19C13.5 19 14.8 18.5 16 17.5"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 17.5C19.5 16 22 12 22 12C22 12 18.3636 5 12 5C10.5 5 9.2 5.5 8 6.5"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="signup-page__form-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                minLength={8}
                aria-required="true"
                aria-describedby="password-requirements"
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword" className="signup-page__label">
                Confirmar contraseña
              </label>
              <button
                type="button"
                className="signup-page__toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                tabIndex={0}
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 10.5C10.0353 10.9532 9.75 11.5735 9.75 12.25C9.75 13.6307 10.8693 14.75 12.25 14.75C12.9265 14.75 13.5468 14.4647 14 14"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 6.5C4.5 8 2 12 2 12C2 12 5.63636 19 12 19C13.5 19 14.8 18.5 16 17.5"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 17.5C19.5 16 22 12 22 12C22 12 18.3636 5 12 5C10.5 5 9.2 5.5 8 6.5"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div
              className="signup-page__requirements"
              id="password-requirements"
            >
              <p>La contraseña debe tener:</p>
              <ul>
                <li className={formData.password.length >= 8 ? "valid" : ""}>
                  ✓ Al menos 8 caracteres
                </li>
                <li className={/[A-Z]/.test(formData.password) ? "valid" : ""}>
                  ✓ Al menos una letra mayúscula
                </li>
                <li className={/\d/.test(formData.password) ? "valid" : ""}>
                  ✓ Al menos un número
                </li>
                <li
                  className={
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                      formData.password
                    )
                      ? "valid"
                      : ""
                  }
                >
                  ✓ Al menos un carácter especial (!@#$%^&*)
                </li>
                <li
                  className={
                    formData.password === formData.confirmPassword &&
                    formData.password.length > 0
                      ? "valid"
                      : ""
                  }
                >
                  ✓ Contraseñas coincidentes
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="signup-page__submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  CREANDO CUENTA...
                </>
              ) : (
                "CREAR CUENTA"
              )}
            </button>

            <div className="signup-page__login">
              <span>¿Ya tienes una cuenta? </span>
              <button
                type="button"
                className="signup-page__login-link"
                onClick={() => navigate("/login")}
                aria-label="Ir a página de inicio de sesión"
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

export default SignupPage;
