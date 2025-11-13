import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import paymentService from "../services/paymentService";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../auth/AuthProvider";

export default function Payments() {
  const { shopId } = useParams();
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: "", method: "UPI", customerName: "", customerPhone: "", note: "" });

  useSocket(shopId, ({ type, payload }) => {
    if (type === "payment:new") setPayments(p => [payload, ...p]);
    if (type === "payment:update") setPayments(p => p.map(x => (String(x._id) === String(payload.paymentId) ? { ...x, status: payload.status } : x)));
  });

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      try {
        const res = await paymentService.getPayments(shopId, { page: 1, limit: 200 });
        setPayments(res.data || []);
      } catch (err) {
        setPayments([]);
      }
    })();
  }, [shopId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return alert("Enter valid amount");
    const payload = { shopId, amount: Number(form.amount), method: form.method, customerName: form.customerName, customerPhone: form.customerPhone, note: form.note };
    try {
      const created = await paymentService.simulatePayment(payload);
      setPayments(p => [created, ...p]);
      setForm({ amount: "", method: "UPI", customerName: "", customerPhone: "", note: "" });
    } catch {
      alert("Simulation failed");
    }
  };

  const handleRefund = async (id) => {
    if (!token) return alert("Login required to refund");
    if (!confirm("Refund this transaction?")) return;
    try {
      await paymentService.refundPayment(id, token);
      setPayments(p => p.map(x => (String(x._id) === String(id) ? { ...x, status: "refunded" } : x)));
    } catch {
      alert("Refund failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm max-w-2xl">
            <div className="text-lg font-semibold mb-3">Simulate Payment</div>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount" className="border px-3 py-2 rounded" />
              <select value={form.method} onChange={e=>setForm({...form,method:e.target.value})} className="border px-3 py-2 rounded">
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
              <input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer Name" className="border px-3 py-2 rounded" />
              <input value={form.customerPhone} onChange={e=>setForm({...form,customerPhone:e.target.value})} placeholder="Phone" className="border px-3 py-2 rounded" />
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Note (optional)" className="border px-3 py-2 rounded md:col-span-3" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-1">Simulate Pay</button>
            </form>
          </div>

          <div className="grid md:grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-3">Transactions</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id} className="border-t">
                        <td className="px-3 py-2 text-sm">{String(p._id).slice(-6)}</td>
                        <td className="px-3 py-2 text-sm">{p.customerName || p.customerPhone || "-"}</td>
                        <td className="px-3 py-2 text-sm">₹{p.amount}</td>
                        <td className="px-3 py-2 text-sm">{p.method}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={
                            p.status === "paid" ? "text-green-600 font-medium" :
                            p.status === "failed" ? "text-red-600 font-medium" :
                            "text-yellow-600 font-medium"
                          }>{p.status}</span>
                        </td>
                        <td className="px-3 py-2 text-sm">{new Date(p.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2 text-sm flex gap-2">
                          <button onClick={()=>navigator.clipboard.writeText(p._id)} className="px-2 py-1 bg-gray-100 rounded">Copy ID</button>
                          {p.status !== "refunded" && <button onClick={()=>handleRefund(p._id)} className="px-2 py-1 bg-red-500 text-white rounded">Refund</button>}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-3 py-6 text-center text-gray-400">No transactions yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}