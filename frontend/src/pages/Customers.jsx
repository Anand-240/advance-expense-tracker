import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomerTable from "../components/Tables/CustomerTable";
import customerService from "../services/customerService";

export default function Customers() {
  const { shopId } = useParams();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const res = await customerService.getCustomers(shopId);
      setCustomers(res || []);
    })();
  }, [shopId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar shopId={shopId} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <CustomerTable customers={customers} />
        </div>
      </div>
    </div>
  );
}