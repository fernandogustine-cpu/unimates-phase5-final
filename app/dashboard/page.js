"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CoachDashboard() {
  const [stats, setStats] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: statsData } = await supabase
      .from("student_puzzle_stats")
      .select("*")
      .order("total_score", { ascending: false });

    const { data: attemptsData } = await supabase
      .from("puzzle_attempts")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(10);

    setStats(statsData || []);
    setAttempts(attemptsData || []);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Coach Fernando Dashboard</h1>

      <p>
        Track student puzzle performance, scores, accuracy and streaks.
      </p>

      <h2>Student Puzzle Statistics</h2>

      {stats.map((student) => {
        const accuracy =
          student.total_attempts > 0
            ? Math.round(
                (student.correct_attempts /
                  student.total_attempts) *
                  100
              )
            : 0;

        return (
          <div
            key={student.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "16px",
              border: "1px solid #ddd",
            }}
          >
            <h3>{student.student_name}</h3>

            <p>
              <strong>Total Score:</strong> {student.total_score}
            </p>

            <p>
              <strong>Total Attempts:</strong>{" "}
              {student.total_attempts}
            </p>

            <p>
              <strong>Correct Attempts:</strong>{" "}
              {student.correct_attempts}
            </p>

            <p>
              <strong>Accuracy:</strong> {accuracy}%
            </p>

            <p>
              <strong>Current Streak:</strong>{" "}
              {student.current_streak}
            </p>

            <p>
              <strong>Best Streak:</strong>{" "}
              {student.best_streak}
            </p>
          </div>
        );
      })}

      <h2>Recent Puzzle Attempts</h2>

      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          style={{
            background: "#f7f9fb",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "10px",
            border: "1px solid #ddd",
          }}
        >
          <p>
            <strong>Student:</strong>{" "}
            {attempt.student_name || "Guest Student"}
          </p>

          <p>
            <strong>Move Played:</strong>{" "}
            {attempt.move_played}
          </p>

          <p>
            <strong>Correct:</strong>{" "}
            {attempt.is_correct ? "Yes" : "No"}
          </p>
        </div>
      ))}

      <button
        onClick={loadDashboard}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
}
