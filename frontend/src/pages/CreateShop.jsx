import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shopService from "../services/shopService";
import { useAuth } from "../auth/AuthProvider";

export default function CreateShop() {
  const [form, setForm] = useState({ name: "", ownerName: "", email: "", phone: "", address: "" });
  const navigate = useNavigate();
  const { token } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/auth/login");
    const shop = await shopService.createShop(form, token);
    navigate(`/shops/${shop._id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl mb-4">Create Shop</h2>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Shop Name" className="w-full mb-3 border px-3 py-2" />
        <input value={form.ownerName} onChange={e=>setForm({...form,ownerName:e.target.value})} placeholder="Owner Name" className="w-full mb-3 border px-3 py-2" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full mb-3 border px-3 py-2" />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="w-full mb-3 border px-3 py-2" />
        <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Address" className="w-full mb-3 border px-3 py-2" />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Create</button>
      </form>
    </div>
  );
}