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
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="signup-page__input"
                required
              />
            </div>

            <div className="signup-page__form-group">
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="signup-page__input"
                required
              />
            </div>

            <div className="signup-page__form-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="signup-page__input"
                required
              />
            </div>

            <div className="signup-page__form-group">
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                className="signup-page__input"
                required
                min="1"
                max="120"
              />
            </div>

            <div className="signup-page__form-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="signup-page__input"
                required
                minLength={6}
              />
            </div>

            <div className="signup-page__form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-page__input"
                required
                minLength={6}
              />
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
