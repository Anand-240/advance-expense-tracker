import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shopService from "../services/shopService";
import paymentService from "../services/paymentService";
export default function CustomerPay() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "UPI", customerName: "", customerPhone: "" });
  useEffect(()=>{ if (!shopId) return; (async()=>{ const s = await shopService.getShop(shopId); setShop(s); })(); }, [shopId]);
  const submit = async (e) => {
    e.preventDefault();
    await paymentService.simulatePayment({ shopId, amount: Number(form.amount), method: form.method, customerName: form.customerName, customerPhone: form.customerPhone });
    navigate(`/shops/${shopId}`);
  };
  if (!shop) return <div className="p-6">Loading...</div>;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl mb-2">{shop.name}</h2>
        <div className="text-sm text-gray-500 mb-4">Pay to {shop.name}</div>
        <form onSubmit={submit} className="space-y-3">
          <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount" className="w-full border px-3 py-2" />
          <select value={form.method} onChange={e=>setForm({...form,method:e.target.value})} className="w-full border px-3 py-2">
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
          <input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Your Name" className="w-full border px-3 py-2" />
          <input value={form.customerPhone} onChange={e=>setForm({...form,customerPhone:e.target.value})} placeholder="Phone" className="w-full border px-3 py-2" />
          <button className="w-full bg-indigo-600 text-white py-2 rounded">Pay Now</button>
        </form>
      </div>
    </div>
  );
}