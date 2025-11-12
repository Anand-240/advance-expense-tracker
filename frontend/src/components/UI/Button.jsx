import React from "react";

export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm " +
        className
      }
    >
      {children}
    </button>
  );
}