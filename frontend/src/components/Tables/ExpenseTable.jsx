import React from "react";

export default function ExpenseTable({ expenses = [] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-600 mb-3">Recent Expenses</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-t">
                <td className="px-3 py-2">{e.category}</td>
                <td className="px-3 py-2">₹{e.amount}</td>
                <td className="px-3 py-2">{e.description || "-"}</td>
                <td className="px-3 py-2">{new Date(e.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-6 text-center text-gray-400">No expenses yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}