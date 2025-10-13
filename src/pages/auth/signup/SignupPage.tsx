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
    <div className="signup-page">
      <div className="signup-page__container">
        <div className="signup-page__card">
          <button className="signup-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>
          <div className="signup-page__logo">
            <img src="/main-logo.svg" alt="Maraton Logo" />
          </div>

          <h1 className="signup-page__title">Crea tu cuenta</h1>
          <p className="signup-page__subtitle">
            Únete a nuestra plataforma de contenido audiovisual
          </p>

          {error && (
            <div className="signup-page__error">
              {error}
            </div>
          )}

          <form className="signup-page__form" onSubmit={handleSubmit}>
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
                minLength={6}
              />
              <label htmlFor="password" className="signup-page__label">
                Contraseña
              </label>
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
                minLength={6}
              />
              <label htmlFor="confirmPassword" className="signup-page__label">
                Confirmar contraseña
              </label>
            </div>

            <button 
              type="submit" 
              className="signup-page__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREANDO CUENTA..." : "CREAR CUENTA"}
            </button>

            <div className="signup-page__login">
              <span>¿Ya tienes una cuenta? </span>
              <button
                type="button"
                className="signup-page__login-link"
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

export default SignupPage;
