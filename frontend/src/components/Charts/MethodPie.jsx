import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export default function MethodPie({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm" style={{ height: 320 }}>
      <div className="text-sm text-gray-600 mb-2">Payment Method Split</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="method" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}