import { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/expenses");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/expenses");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="button" style={{ marginTop: '10px' }}>Iniciar Sesión</button>
      </form>
      <div style={{ textAlign: 'right' }}>
        <button onClick={handleGoogleLogin} style={{ marginTop: '40px' }} className="button-secondary">
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

export default Login;
