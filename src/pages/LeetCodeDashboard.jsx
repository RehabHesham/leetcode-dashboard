import React, { useState, useEffect } from "react";
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

export default function LeetCodeDashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [title, setTitle] = useState("🏆 LeetCode Challenge Leaderboard");
  const [scores, setScores] = useState({ easy: 5, medium: 10, hard: 20 });
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const leaderboardUrl = "leaderboard.csv"; // GitHub Pages version loads static CSV
    try {
      const response = await fetch(leaderboardUrl);
      const text = await response.text();
      const data = Papa.parse(text, { header: true }).data;
      setLeaderboard(data);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => (b.Score || 0) - (a.Score || 0)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>

      {/* Admin Controls - hidden on GitHub Pages */}
      {isAdmin && (
        <div className="bg-white p-4 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium">Easy Score</label>
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
              <label className="block text-sm font-medium">Medium Score</label>
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
              <label className="block text-sm font-medium">Hard Score</label>
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
          <p className="text-gray-500 text-sm mt-2">
            (These controls only appear in admin mode)
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading leaderboard...</p>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

      <footer className="text-center text-gray-500 text-sm mt-8">
        Last updated automatically by GitHub Actions.
      </footer>
    </div>
  );
}
