import React from "react";
import { Link } from "react-router-dom";

const isAdmin = import.meta.env.VITE_ADMIN === "true";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">LeetCode Challenge</div>
      <div className="flex gap-4 text-gray-700">
        <Link to="/" className="hover:text-blue-600">
          Competition Info
        </Link>
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        {/* 👇 Admin-only link */}
        {isAdmin && (
          <Link to="/admin" className="hover:text-blue-600">
            Admin Panel
          </Link>
        )}
      </div>
    </nav>
  );
}
