import { useEffect, useState } from "react";
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
    <div style={{ minWidth: "500px"}}>
      <div className="expense-details">
        <h2 style={{ textAlign: "center" }}>Detalles del Gasto</h2>
        <p><strong>Nombre:</strong> {expense.name}</p>
        <p><strong>Detalle:</strong> {expense.detail}</p>
        <p><strong>Monto Total:</strong> ARS {expense.amount}</p>
      </div>

      <h3 style={{ textAlign: "center", marginTop: "20px" }}>División entre Participantes</h3>
      {expense.participants?.length === 0
        ?  <em>Agrega personas para repartir los gastos</em>
        : <ul className="expenses-list">
            {expense.participants?.map((participant, index) => (
              <li className="expense-item" key={index}>
                {participant}: ARS {amountPerPerson}
              </li>
            ))}
          </ul>
      }

      {!isFinalized && (
        <>
          <h3 style={{ marginTop: "20px", textAlign: "center" }}>Agregar Persona</h3>
          <input
            type="text"
            placeholder="Nombre de la persona"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            className="input-field"
          />
          <button onClick={addParticipant} className="button">Agregar</button>
        </>
      )}

      {!isFinalized && (
        <div style={{ marginTop: "40px" }}>
          <button disabled={expense.participants?.length === 0} onClick={finalizeExpense} className="button" style={{ width: "100%"}}>Listo</button>
        </div>
      )}

      {isFinalized && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={deleteExpense} className="button" style={{ width: "100%" }}>
            Eliminar Gasto
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseDetail;
