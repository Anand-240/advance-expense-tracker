import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Payments from "./pages/Payments.jsx";
import Expenses from "./pages/Expenses.jsx";
import Reports from "./pages/Reports.jsx";
import Customers from "./pages/Customers.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyShops from "./pages/MyShops.jsx";
import CreateShop from "./pages/CreateShop.jsx";
import CustomerPay from "./pages/CustomerPay.jsx";
import Profile from "./pages/Profile.jsx";
import MockWebhookPay from "./pages/MockWebhookPay.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/myshops" replace />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/mock-webhook" element={<MockWebhookPay />} />
      <Route path="/myshops" element={<ProtectedRoute><MyShops /></ProtectedRoute>} />
      <Route path="/shops/create" element={<ProtectedRoute><CreateShop /></ProtectedRoute>} />
      <Route path="/shops/:shopId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/shops/:shopId/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/shops/:shopId/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/shops/:shopId/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/shops/:shopId/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/pay/:shopId" element={<CustomerPay />} />
      <Route path="*" element={<div className="p-6 text-center">404</div>} />
    </Routes>
  );
}