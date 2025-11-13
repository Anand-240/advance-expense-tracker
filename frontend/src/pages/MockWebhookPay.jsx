import React, { useState } from "react";

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await window.crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

export default function MockWebhookPay() {
  const [form, setForm] = useState({ shopId: "", amount: "100", method: "UPI", customerName: "Demo Customer", referenceId: `demo-${Date.now()}` });
  const [secret, setSecret] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      provider: "mock",
      referenceId: form.referenceId,
      shopId: form.shopId,
      amount: Number(form.amount),
      status: "paid",
      method: form.method,
      customerName: form.customerName
    };
    const body = JSON.stringify(payload);
    let signature = "";
    try {
      signature = await hmacSha256(secret || "", body);
    } catch (err) {
      signature = "";
    }
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/webhooks/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature
        },
        body
      });
      const data = await r.json().catch(() => null);
      setResp({ status: r.status, ok: r.ok, data });
    } catch (err) {
      setResp({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Mock Webhook Payment (Local Demo)</h2>
        <form onSubmit={submit} className="space-y-3">
          <input placeholder="Shop ID or Shop Name" value={form.shopId} onChange={e=>setForm({...form,shopId:e.target.value})} className="w-full border px-3 py-2 rounded" />
          <input placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="w-full border px-3 py-2 rounded" />
          <select value={form.method} onChange={e=>setForm({...form,method:e.target.value})} className="w-full border px-3 py-2 rounded">
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
          <input placeholder="Customer Name" value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} className="w-full border px-3 py-2 rounded" />
          <input placeholder="Reference ID (optional)" value={form.referenceId} onChange={e=>setForm({...form,referenceId:e.target.value})} className="w-full border px-3 py-2 rounded" />
          <input placeholder="Webhook Secret (paste from backend .env WEBHOOK_SECRET)" value={secret} onChange={e=>setSecret(e.target.value)} className="w-full border px-3 py-2 rounded" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
              {loading ? "Sending..." : "Send Mock Webhook"}
            </button>
            <button type="button" onClick={()=>{ setForm({ ...form, referenceId: `demo-${Date.now()}` }); setResp(null); }} className="px-4 py-2 bg-gray-100 rounded">
              New Ref
            </button>
          </div>
        </form>
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Response</div>
          <pre className="bg-gray-50 p-3 rounded text-sm">{JSON.stringify(resp, null, 2)}</pre>
        </div>
        <div className="mt-4 text-xs text-gray-500">Open the shop dashboard in another tab to see real-time update after webhook is accepted.</div>
      </div>
    </div>
  );
}