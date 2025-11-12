import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PaymentsTable from "../components/Tables/PaymentsTable";
import paymentService from "../services/paymentService";
import { useSocket } from "../hooks/useSocket";

export default function Payments() {
  const { shopId } = useParams();
  const [payments, setPayments] = useState([]);
  useSocket(shopId, ({ type, payload }) => {
    if (type === "payment:new") setPayments(p => [payload, ...p]);
    if (type === "payment:update") setPayments(p => p.map(x => (x._id === payload.paymentId ? { ...x, status: payload.status } : x)));
  });

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const res = await paymentService.getPayments(shopId, { page: 1, limit: 200 });
      setPayments(res.data || []);
    })();
  }, [shopId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <PaymentsTable payments={payments} />
        </div>
      </div>
    </div>
  );
}