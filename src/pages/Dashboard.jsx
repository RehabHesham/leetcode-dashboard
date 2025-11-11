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

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // GitHub Pages version loads static CSV (must be in /public or root of repo)
  const leaderboardUrl = "leaderboard.csv";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(leaderboardUrl);
        const text = await response.text();
        const data = Papa.parse(text, { header: true }).data;

        // Clean data and ensure numeric values
        const cleaned = data
          .filter((row) => row.Name && row.Score)
          .map((row) => ({
            Name: row.Name,
            Easy: +row.Easy || 0,
            Medium: +row.Medium || 0,
            Hard: +row.Hard || 0,
            Score: +row.Score || 0,
          }));

        setLeaderboard(cleaned);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.Score - a.Score);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏆 LeetCode Challenge Leaderboard
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading leaderboard...</p>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Leaderboard Table */}
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

          {/* Top 10 Chart */}
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
