import React from "react";

export default function CustomerTable({ customers = [] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-600 mb-3">Top Customers</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Total Spent</th>
              <th className="px-3 py-2">Visits</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.phone || "-"}</td>
                <td className="px-3 py-2">₹{c.totalSpent}</td>
                <td className="px-3 py-2">{c.totalVisits}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-6 text-center text-gray-400">No customers yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}