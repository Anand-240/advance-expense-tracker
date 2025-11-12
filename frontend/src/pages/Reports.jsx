import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProfitChart from "../components/Charts/ProfitChart";
import MethodPie from "../components/Charts/MethodPie";
import reportService from "../services/reportService";

export default function Reports() {
  const { shopId } = useParams();
  const [summary, setSummary] = useState({});
  const [methodSplit, setMethodSplit] = useState([]);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const sum = await reportService.getSummary(shopId);
      const tr = await reportService.getTrends(shopId);
      setSummary(sum.kpis || {});
      setMethodSplit(sum.methodSplit || []);
      setTrend(tr || []);
    })();
  }, [shopId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ProfitChart data={trend.map(t => ({ time: t.time, profit: t.revenue }))} />
            </div>
            <MethodPie data={methodSplit} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-700 text-sm mb-3 font-medium">Summary</div>
            <div className="grid md:grid-cols-5 gap-4 text-sm">
              <div>Revenue: ₹{summary.revenue}</div>
              <div>Sales: {summary.sales}</div>
              <div>Expenses: ₹{summary.expenses}</div>
              <div>Profit: ₹{summary.profit}</div>
              <div>Avg Order: ₹{summary.avgOrder}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}