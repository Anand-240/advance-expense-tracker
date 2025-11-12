import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="h-8 w-8" />
        <Link to="/" className="font-semibold text-lg">SmartPay Tracker</Link>
      </div>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link to="/auth/login" className="text-sm text-gray-700">Login</Link>
            <Link to="/auth/register" className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">Register</Link>
          </>
        )}
        {user && (
          <>
            <div className="text-sm text-gray-700">Hello, {user.name}</div>
            <button onClick={() => navigate("/profile")} className="text-sm px-3 py-1 border rounded">Profile</button>
            <button onClick={() => { logout(); navigate("/"); }} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}