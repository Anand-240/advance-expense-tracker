import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shopService from "../services/shopService";
import { useAuth } from "../auth/AuthProvider";

export default function MyShops() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      if (!token) return navigate("/auth/login");
      const res = await shopService.getMyShops(token);
      setShops(res || []);
    })();
  }, [token]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">My Shops</h2>
          <button onClick={()=>navigate("/shops/create")} className="bg-indigo-600 text-white px-3 py-2 rounded">Create Shop</button>
        </div>
        <div className="grid gap-3">
          {shops.map(s => (
            <div key={s._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-500">{s.phone || s.email || s.address}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>navigate(`/shops/${s._id}`)} className="px-3 py-2 bg-green-500 text-white rounded">Open</button>
                <button onClick={()=>navigate(`/pay/${s._id}`)} className="px-3 py-2 bg-blue-500 text-white rounded">Pay Link</button>
              </div>
            </div>
          ))}
          {shops.length === 0 && <div className="text-gray-500">No shops yet</div>}
        </div>
      </div>
    </div>
  );
}