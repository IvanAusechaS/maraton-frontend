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
                type="password"
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
              <div id="password-requirements" className="signup-page__hint">
                Mínimo 8 caracteres, incluye mayúscula, número y carácter
                especial
              </div>
            </div>

            <div className="signup-page__form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                minLength={8}
                aria-required="true"
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword" className="signup-page__label">
                Confirmar contraseña
              </label>
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
