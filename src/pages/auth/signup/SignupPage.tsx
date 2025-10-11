import "./SignupPage.scss";


const SignUp = () => {
  return (
    <div className="signup-page">
      <h2>Registro</h2>
      <form>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" required />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default SignUp;
