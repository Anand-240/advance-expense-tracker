import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ProfitChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-72">
      <div className="text-sm text-gray-600 mb-2">Profit (Revenue - Expenses)</div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="profit" fill="#059669" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}