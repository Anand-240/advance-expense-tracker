import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-4">Profile</h2>
        <div className="mb-2"><span className="font-semibold">Name: </span>{user.name}</div>
        <div className="mb-2"><span className="font-semibold">Email: </span>{user.email}</div>
        <div className="mb-2"><span className="font-semibold">Member since: </span>{new Date(user.createdAt || "").toLocaleString()}</div>
      </div>
    </div>
  );
}