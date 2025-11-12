import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/UI/StatCard";
import SalesChart from "../components/Charts/SalesChart";
import MethodPie from "../components/Charts/MethodPie";
import PaymentsTable from "../components/Tables/PaymentsTable";
import ExpenseTable from "../components/Tables/ExpenseTable";
import { useSocket } from "../hooks/useSocket";
import shopService from "../services/shopService";
import paymentService from "../services/paymentService";
import expenseService from "../services/expenseService";

export default function Dashboard() {
  const { shopId } = useParams();
  const [summary, setSummary] = useState({ revenue: 0, sales: 0, avgOrder: 0, expenses: 0, profit: 0 });
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  useSocket(shopId, ({ type, payload }) => {
    if (type === "payment:new") {
      setPayments(p => [payload, ...p].slice(0, 50));
      setSummary(s => ({ ...s, revenue: Number(s.revenue) + Number(payload.amount), sales: Number(s.sales) + 1 }));
    }
    if (type === "expense:new") {
      setExpenses(e => [payload, ...e].slice(0, 50));
      setSummary(s => ({ ...s, expenses: Number(s.expenses) + Number(payload.amount), profit: Number(s.profit) - Number(payload.amount) }));
    }
  });

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const s = await shopService.getSummary(shopId);
      setSummary(s);
      const p = await paymentService.getPayments(shopId, { page: 1, limit: 20 });
      setPayments(p.data || []);
      const ex = await expenseService.getExpenses(shopId, { page: 1, limit: 10 });
      setExpenses(ex.data || []);
    })();
  }, [shopId]);

  const pieData = [];
  const chartData = [];

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard title="Revenue" value={`₹${summary.revenue}`} />
            <StatCard title="Sales" value={summary.sales} />
            <StatCard title="Avg Order" value={`₹${summary.avgOrder}`} />
            <StatCard title="Profit" value={`₹${summary.profit}`} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SalesChart data={chartData} />
            </div>
            <div className="space-y-4">
              <MethodPie data={pieData} />
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Quick Actions</div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded">Simulate Payment</button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <PaymentsTable payments={payments} />
            <ExpenseTable expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}