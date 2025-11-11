import { useState } from "react";

export default function CompetitionSetup() {
  const [competition, setCompetition] = useState({
    name: "LeetCode Weekly Challenge",
    goal: "Improve algorithmic thinking and coding speed",
    duration: "1 week",
    tracks: [".NET", "MERN"],
    rules: [
      "Languages: C# and JavaScript",
      "Only new problems solved during the competition count",
      "Scoring: Easy = 5, Medium = 10, Hard = 20",
    ],
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
        {competition.name}
      </h1>
      <p className="text-gray-700 mb-2">
        <strong>Goal:</strong> {competition.goal}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Duration:</strong> {competition.duration}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Tracks:</strong> {competition.tracks.join(", ")}
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Rules</h2>
      <ul className="list-disc pl-6 text-gray-700">
        {competition.rules.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
