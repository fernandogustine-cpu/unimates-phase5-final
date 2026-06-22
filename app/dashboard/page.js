"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CoachDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data, error } = await supabase
      .from("puzzle_attempts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Dashboard error: " + error.message);
      return;
    }

    const rows = data || [];
    setAttempts(rows.slice(0, 10));

    const grouped = {};

    rows.forEach((a) => {
      const name = a.student_name || "Guest Student";

      if (!grouped[name]) {
        grouped[name] = {
          student_name: name,
          total_attempts: 0,
          correct_attempts: 0,
          total_score: 0,
        };
      }

      grouped[name].total_attempts += 1;

      if (a.is_correct === true) {
        grouped[name].correct_attempts += 1;
        grouped[name].total_score += 10;
      }
    });

    setStats(Object.values(grouped));
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Coach Fernando Dashboard</h1>
      <p>Track student puzzle performance, scores, accuracy and attempts.</p>

      <h2>Student Puzzle Statistics</h2>

      {stats.length === 0 ? (
        <p>No puzzle statistics found yet.</p>
      ) : (
        stats.map((student) => {
          const accuracy =
            student.total_attempts > 0
              ? Math.round(
                  (student.correct_attempts / student.total_attempts) * 100
                )
              : 0;

          return (
            <div key={student.student_name} style={cardStyle}>
              <h3>{student.student_name}</h3>
              <p>Total Score: {student.total_score}</p>
              <p>Total Attempts: {student.total_attempts}</p>
              <p>Correct Attempts: {student.correct_attempts}</p>
              <p>Accuracy: {accuracy}%</p>
            </div>
          );
        })
      )}

      <h2>Recent Puzzle Attempts</h2>

      {attempts.length === 0 ? (
        <p>No recent attempts found.</p>
      ) : (
        attempts.map((attempt) => (
          <div key={attempt.id} style={smallCardStyle}>
            <p>
              <strong>Student:</strong>{" "}
              {attempt.student_name || "Guest Student"}
            </p>
            <p>
              <strong>Answer:</strong>{" "}
              {attempt.submitted_answer || attempt.move_played || "N/A"}
            </p>
            <p>
              <strong>Correct:</strong>{" "}
              {attempt.is_correct ? "Yes" : "No"}
            </p>
          </div>
        ))
      )}

      <button onClick={loadDashboard} style={buttonStyle}>
        Refresh Dashboard
      </button>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const smallCardStyle = {
  background: "#f9fafb",
  padding: "12px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const buttonStyle = {
  marginTop: "18px",
  background: "#2563eb",
  color: "white",
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
