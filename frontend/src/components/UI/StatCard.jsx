import React from "react";

export default function StatCard({ title, value, delta, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {delta !== undefined && (
          <div className="text-xs text-gray-400 mt-1">{delta}</div>
        )}
      </div>
      {icon && <div className="ml-4">{icon}</div>}
    </div>
  );
}