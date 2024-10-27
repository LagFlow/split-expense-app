import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";

function ExpenseDetail() {
  const { id } = useParams(); // Obtiene el id del gasto desde la URL
  const navigate = useNavigate(); // Navegación para redirigir después de eliminar
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newParticipant, setNewParticipant] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);

  // Función para cargar los detalles del gasto desde Firestore
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const expenseRef = doc(db, "expenses", id);
        const expenseSnap = await getDoc(expenseRef);

        if (expenseSnap.exists()) {
          setExpense(expenseSnap.data());
          setIsFinalized(expenseSnap.data().isFinalized || false);
        } else {
          console.log("No se encontró el gasto.");
        }
      } catch (error) {
        console.error("Error al cargar el gasto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  // Función para agregar una nueva persona al gasto
  const addParticipant = async () => {
    if (!newParticipant) {
      alert("Por favor, ingresa un nombre.");
      return;
    }

    try {
      const expenseRef = doc(db, "expenses", id);
      await updateDoc(expenseRef, {
        participants: arrayUnion(newParticipant)
      });
      setExpense((prevExpense) => ({
        ...prevExpense,
        participants: [...(prevExpense.participants || []), newParticipant]
      }));
      setNewParticipant("");
    } catch (error) {
      console.error("Error al agregar la persona:", error);
    }
  };

  // Función para finalizar el reparto y guardar los montos finales
  const finalizeExpense = async () => {
    const numPeople = expense.participants?.length || 0;
    const amountPerPerson = numPeople > 0 ? (expense.amount / numPeople).toFixed(2) : 0;

    const finalizedContributions = expense.participants?.map((participant) => ({
      name: participant,
      amount: amountPerPerson
    }));

    try {
      const expenseRef = doc(db, "expenses", id);
      await updateDoc(expenseRef, {
        contributions: finalizedContributions,
        isFinalized: true
      });
      setIsFinalized(true);
      setExpense((prevExpense) => ({
        ...prevExpense,
        contributions: finalizedContributions
      }));
    } catch (error) {
      console.error("Error al finalizar el gasto:", error);
    }
  };

  // Función para eliminar el gasto
  const deleteExpense = async () => {
    try {
      const expenseRef = doc(db, "expenses", id);
      await deleteDoc(expenseRef);
      alert("Gasto eliminado exitosamente.");
      navigate("/"); // Redirige a la página principal después de eliminar
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      alert("Hubo un error al eliminar el gasto.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!expense) {
    return <p>No se encontró el gasto.</p>;
  }

  const numPeople = expense.participants?.length || 0;
  const amountPerPerson = numPeople > 0 ? (expense.amount / numPeople).toFixed(2) : 0;

  return (
    <div style={{ margin: "20px" }}>
      <h2>Detalles del Gasto</h2>
      <p><strong>Nombre:</strong> {expense.name}</p>
      <p><strong>Detalle:</strong> {expense.detail}</p>
      <p><strong>Monto Total:</strong> ARS {expense.amount}</p>

      <h3>División entre Participantes</h3>
      <ul>
        {expense.participants?.map((participant, index) => (
          <li key={index}>
            {participant}: ARS {amountPerPerson}
          </li>
        ))}
      </ul>

      {!isFinalized && (
        <>
          <h3>Agregar Persona</h3>
          <input
            type="text"
            placeholder="Nombre de la persona"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
          />
          <button onClick={addParticipant}>Agregar</button>
        </>
      )}

      {!isFinalized && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={finalizeExpense}>Listo</button>
        </div>
      )}

      {isFinalized && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={deleteExpense} style={{ backgroundColor: "red", color: "white" }}>
            Eliminar Gasto
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseDetail;
