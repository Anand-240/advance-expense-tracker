import React from "react";

export default function PaymentsTable({ payments = [] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-600 mb-3">Recent Payments</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-3 py-2 text-sm">{String(p._id).slice(-6)}</td>
                <td className="px-3 py-2">₹{p.amount}</td>
                <td className="px-3 py-2">{p.method}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-gray-400">No payments yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}