import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExpenseTable from "../components/Tables/ExpenseTable";
import expenseService from "../services/expenseService";
import { useSocket } from "../hooks/useSocket";

export default function Expenses() {
  const { shopId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "Other", amount: "", description: "" });

  useSocket(shopId, ({ type, payload }) => {
    if (type === "expense:new") setExpenses(e => [payload, ...e]);
  });

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const res = await expenseService.getExpenses(shopId, { page: 1, limit: 100 });
      setExpenses(res.data || []);
    })();
  }, [shopId]);

  const submitExpense = async e => {
    e.preventDefault();
    await expenseService.createExpense({ ...form, shopId });
    setForm({ category: "Other", amount: "", description: "" });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <form onSubmit={submitExpense} className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-2">
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border px-3 py-2 rounded w-32" />
            <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border px-3 py-2 rounded w-32" />
            <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded flex-1" />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Expense</button>
          </form>
          <ExpenseTable expenses={expenses} />
        </div>
      </div>
    </div>
  );
}