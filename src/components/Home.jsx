import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si el usuario está autenticado, redirige a la página de gastos
        navigate("/expenses");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a Split Expense App</h1>
      <p>Divide tus gastos de forma equitativa con amigos y familiares.</p>
      <div>
        <Link to="/login">
          <button style={{ margin: "10px" }}>Iniciar Sesión</button>
        </Link>
        <Link to="/register">
          <button style={{ margin: "10px" }}>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
