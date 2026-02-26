import React, { type JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import TransactionsRoute from "./pages/TransactionsRoute";
import AddTransactionRoute from "./pages/AddTransactionRoute";
import TransactionDetailRoute from "./pages/TransactionDetailRoute";
import ProtectedRoute from "./features/auth/ProtectedRoute";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="transactions" element={<TransactionsRoute />} />
          <Route path="transactions/new" element={<AddTransactionRoute />} />
          <Route path="transactions/:id" element={<TransactionDetailRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}