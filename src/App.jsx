import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Expenses from "./components/Expenses";
import ExpenseDetail from "./components/ExpenseDetail";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/:id" element={<ExpenseDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
