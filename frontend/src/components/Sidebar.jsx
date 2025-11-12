import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ shopId }) {
  return (
    <aside className="w-64 bg-gray-50 border-r p-4 min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-500">Shop</div>
        <div className="text-lg font-semibold">{shopId || "Demo Shop"}</div>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to={`/shops/${shopId}`} className="p-2 rounded hover:bg-gray-100">
          Dashboard
        </NavLink>
        <NavLink to={`/shops/${shopId}/payments`} className="p-2 rounded hover:bg-gray-100">
          Payments
        </NavLink>
        <NavLink to={`/shops/${shopId}/reports`} className="p-2 rounded hover:bg-gray-100">
          Reports
        </NavLink>
        <NavLink to={`/shops/${shopId}/expenses`} className="p-2 rounded hover:bg-gray-100">
          Expenses
        </NavLink>
        <NavLink to={`/shops/${shopId}/customers`} className="p-2 rounded hover:bg-gray-100">
          Customers
        </NavLink>
        <NavLink to="/settings" className="p-2 rounded hover:bg-gray-100">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}