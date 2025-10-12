import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.scss";
import mainLogo from "../../../../public/main-logo.svg";

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
    edad: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // TODO: Implement signup logic
    console.log("Signup attempt:", formData);
  };

  return (
    <div className="signup-page">
      <div className="signup-page__container">
        <div className="signup-page__card">
          <button className="signup-page__back" onClick={() => navigate("/")}>
            ← Regresar al inicio
          </button>
          <div className="signup-page__logo">
            <img src={mainLogo} alt="Maraton Logo" />
          </div>

          <h1 className="signup-page__title">Crea tu cuenta</h1>
          <p className="signup-page__subtitle">
            Únete a nuestra plataforma de contenido audiovisual
          </p>

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
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                className="signup-page__input"
                placeholder=" "
                required
                min="1"
                max="120"
              />
              <label htmlFor="edad" className="signup-page__label">
                Edad
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

            <button type="submit" className="signup-page__submit">
              CREAR CUENTA
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
