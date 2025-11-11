import React, { useState } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const isAdmin = import.meta.env.VITE_ADMIN === "true";

export default function AdminPanel() {
  // 🔒 Restrict access
  if (!isAdmin) {
    return (
      <p className="text-center text-gray-500 mt-8 text-lg">
        🔒 Admin access only
      </p>
    );
  }

  const [leaderboard, setLeaderboard] = useState([]);
  const [scores, setScores] = useState({ easy: 5, medium: 10, hard: 20 });
  const [loading, setLoading] = useState(false);

  // Handle file upload (CSV)
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data
          .filter((row) => row.Name)
          .map((row) => ({
            Name: row.Name,
            Easy: +row.Easy || 0,
            Medium: +row.Medium || 0,
            Hard: +row.Hard || 0,
            Score:
              (+row.Easy || 0) * scores.easy +
              (+row.Medium || 0) * scores.medium +
              (+row.Hard || 0) * scores.hard,
          }));
        setLeaderboard(data);
        setLoading(false);
      },
    });
  };

  // Export leaderboard as CSV
  const exportCSV = () => {
    const csv = Papa.unparse(leaderboard);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leaderboard.csv";
    link.click();
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.Score - a.Score);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛠️ Admin Panel — LeetCode Challenge
      </motion.h1>

      {/* Admin Controls */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Competition Controls</h2>

        <div className="flex flex-wrap gap-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Leaderboard CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleUpload}
              className="block border rounded p-2 w-64"
            />
          </div>

          {/* Scoring Inputs */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Easy</label>
              <input
                type="number"
                className="border p-1 rounded w-20"
                value={scores.easy}
                onChange={(e) =>
                  setScores({ ...scores, easy: +e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Medium</label>
              <input
                type="number"
                className="border p-1 rounded w-20"
                value={scores.medium}
                onChange={(e) =>
                  setScores({ ...scores, medium: +e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Hard</label>
              <input
                type="number"
                className="border p-1 rounded w-20"
                value={scores.hard}
                onChange={(e) =>
                  setScores({ ...scores, hard: +e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          💾 Export Leaderboard CSV
        </button>

        <p className="text-gray-500 text-sm mt-2">
          * This exported file will be deployed to GitHub Pages for students.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center text-gray-500">
          Upload a CSV to view leaderboard.
        </p>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4 mb-8">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Easy</th>
                  <th className="p-2">Medium</th>
                  <th className="p-2">Hard</th>
                  <th className="p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2 font-medium">{row.Name}</td>
                    <td className="p-2">{row.Easy}</td>
                    <td className="p-2">{row.Medium}</td>
                    <td className="p-2">{row.Hard}</td>
                    <td className="p-2 font-bold text-blue-600">{row.Score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Top 10 Students</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedLeaderboard.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Name"
                  interval={0}
                  angle={-20}
                  dy={10}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
