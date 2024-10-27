import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Resetea errores antes de la validación
    setEmailError("");
    setPasswordError("");

    // Validación de email y contraseña
    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un email válido.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/expenses");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        {emailError && <p style={{ color: "red", fontSize: "14px" }}>{emailError}</p>}

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {passwordError && <p style={{ color: "red", fontSize: "14px" }}>{passwordError}</p>}

        <button type="submit" className="button" style={{ marginTop: '10px' }}>Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
