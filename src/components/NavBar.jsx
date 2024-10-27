import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase
import { signOut } from "firebase/auth";

function NavBar() {
  const navigate = useNavigate(); // Hook para la navegación
  const [user, setUser] = useState(null); // Estado para almacenar el usuario

  // Función para manejar el cambio de estado de autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Actualiza el estado si el usuario está autenticado
    });

    // Limpiar el suscriptor al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Función para cerrar la sesión del usuario
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Sesión cerrada exitosamente.");
        navigate("/"); // Redirige al componente Home
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {/* Muestra el botón de Cerrar sesión solo si hay un usuario autenticado */}
      {user && (
        <button onClick={handleLogout} style={{ float: "right" }}>
          Cerrar sesión
        </button>
      )}
    </nav>
  );
}

export default NavBar;
