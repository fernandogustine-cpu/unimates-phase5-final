"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Shell from "../../components/Shell";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);

    const { data, error } = await supabase
      .from("puzzle_attempts")
      .select("*")
      .order("attempted_at", { ascending: false });

    if (error) {
      console.error("Leaderboard error:", error);
      setLoading(false);
      return;
    }

    const grouped = {};

    (data || []).forEach((attempt) => {
      const player = attempt.student_id || "Guest Student";

      if (!grouped[player]) {
        grouped[player] = {
          student: player,
          attempts: 0,
          correct: 0,
          wrong: 0,
          score: 0,
        };
      }

      grouped[player].attempts += 1;

      if (attempt.is_correct) {
        grouped[player].correct += 1;
        grouped[player].score += 10;
      } else {
        grouped[player].wrong += 1;
      }
    });

    const leaderboard = Object.values(grouped).sort(
      (a, b) => b.score - a.score
    );

    setLeaders(leaderboard);
    setLoading(false);
  }

  return (
    <Shell
      title="Leaderboard"
      subtitle="Coach Fernando training system powered by Supabase."
    >
      <h1>Uni-Mates Puzzle Leaderboard</h1>
      <p>Track student puzzle attempts, correct answers, and scores.</p>

      {loading && <p>Loading leaderboard...</p>}

      {!loading && leaders.length === 0 && (
        <p>No puzzle attempts yet. Solve puzzles first.</p>
      )}

      {!loading && leaders.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            overflowX: "auto",
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "16px",
            }}
          >
            <thead>
              <tr style={{ background: "#1e3a8a", color: "white" }}>
                <th style={th}>Rank</th>
                <th style={th}>Student</th>
                <th style={th}>Score</th>
                <th style={th}>Correct</th>
                <th style={th}>Wrong</th>
                <th style={th}>Attempts</th>
                <th style={th}>Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {leaders.map((player, index) => {
                const accuracy =
                  player.attempts > 0
                    ? Math.round((player.correct / player.attempts) * 100)
                    : 0;

                return (
                  <tr key={player.student} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={td}>{index + 1}</td>
                    <td style={td}>{player.student}</td>
                    <td style={td}>{player.score}</td>
                    <td style={td}>{player.correct}</td>
                    <td style={td}>{player.wrong}</td>
                    <td style={td}>{player.attempts}</td>
                    <td style={td}>{accuracy}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={loadLeaderboard}
        style={{
          marginTop: "20px",
          background: "#2563eb",
          color: "white",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Refresh Leaderboard
      </button>
    </Shell>
  );
}

const th = {
  padding: "12px",
  textAlign: "left",
};

const td = {
  padding: "12px",
};
