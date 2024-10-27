import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig"; // Asegúrate de importar auth de Firebase
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

function Expenses() {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid; // Obtiene el ID del usuario autenticado

  // Función para agregar un nuevo gasto
  const addExpense = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar un gasto.");
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        name,
        detail,
        amount: parseFloat(amount),
        currency: "ARS",
        participants: [], // Lista vacía para los participantes
        userId, // Asocia el gasto con el usuario actual
      });
      console.log("Gasto agregado con ID: ", docRef.id);
      setName("");
      setDetail("");
      setAmount("");
      fetchExpenses(); // Actualiza la lista de gastos después de agregar uno nuevo
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  // Función para obtener los gastos del usuario autenticado
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", userId)); // Filtra por userId
      const querySnapshot = await getDocs(q);
      const expensesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesList);
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los gastos cuando el componente se monta
  useEffect(() => {
    fetchExpenses();
  }, [userId]); // Ejecuta nuevamente si userId cambia

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Registrar Gasto</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Detalle"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="input-field"
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input-field"
      />
      <button onClick={addExpense} className="button" style={{ marginTop: '10px' }}>Registrar</button>

      <h3 style={{ marginTop: '50px', textAlign: 'center' }}>Listado de Gastos</h3>
      {loading ? (
        <p>Cargando gastos...</p>
      ) : expenses.length > 0 ? (
        <ul className="expenses-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <Link to={`/expenses/${expense.id}`}>
                <strong>{expense.name}</strong> - ARS {expense.amount} - {expense.detail ? expense.detail + ' - ' : ''} {expense.isFinalized ? '[Finalizado]' : '[Pendiente]'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay gastos registrados.</p>
      )}
    </div>
  );
}

export default Expenses;
