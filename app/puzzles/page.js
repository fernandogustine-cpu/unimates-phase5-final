"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PuzzleTrainer() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadStudents();
    loadPuzzles();
  }, []);

  async function loadStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("full_name")
      .order("full_name", { ascending: true });

    if (error) {
      alert("Student loading error: " + error.message);
      return;
    }

    setStudents(data || []);
  }

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*");

    if (error) {
      alert("Puzzle loading error: " + error.message);
      return;
    }

    setPuzzles(data || []);
    if (data && data.length > 0) {
      setCurrentPuzzle(data[0]);
    }
  }

  async function checkAnswer() {
    if (!studentName) {
      alert("Please select a student first.");
      return;
    }

    if (!currentPuzzle) {
      alert("No puzzle loaded.");
      return;
    }

    const correct =
      answer.trim().toLowerCase() ===
      String(currentPuzzle.solution).trim().toLowerCase();

    const { error } = await supabase.from("puzzle_attempts").insert({
      student_name: studentName,
      puzzle_id: currentPuzzle.id,
      submitted_answer: answer,
      is_correct: correct,
    });

    if (error) {
      alert("Error saving attempt: " + error.message);
      return;
    }

    if (correct) {
      setScore(score + 10);
      setMessage("✅ Correct! Well done.");
    } else {
      setMessage("❌ Incorrect. Try the next one.");
    }

    setAnswer("");
    nextPuzzle();
  }

  function nextPuzzle() {
    if (puzzles.length === 0) return;

    const index = puzzles.findIndex((p) => p.id === currentPuzzle?.id);
    const nextIndex = (index + 1) % puzzles.length;
    setCurrentPuzzle(puzzles[nextIndex]);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Uni-Mates Puzzle Trainer</h1>

      <p>Student: {studentName || "Not selected"}</p>
      <p>Score: {score}</p>

      <div style={{ marginBottom: "20px" }}>
        <label><strong>Select Student</strong></label>
        <br />

        <select
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={inputStyle}
        >
          <option value="">Choose Student</option>

          {students.map((student) => (
            <option key={student.full_name} value={student.full_name}>
              {student.full_name}
            </option>
          ))}
        </select>
      </div>

      {currentPuzzle ? (
        <div style={cardStyle}>
          <h2>{currentPuzzle.title || "Chess Puzzle"}</h2>

          <p>
            <strong>Theme:</strong>{" "}
            {currentPuzzle.theme || "Tactics"}
          </p>

          <p>
            <strong>Difficulty:</strong>{" "}
            {currentPuzzle.difficulty || "Training"}
          </p>

          <p>
            <strong>FEN:</strong>{" "}
            {currentPuzzle.fen || "No FEN added"}
          </p>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter move, example: Bxc6"
            style={inputStyle}
          />

          <br />

          <button onClick={checkAnswer} style={buttonStyle}>
            Submit Answer
          </button>

          <button onClick={nextPuzzle} style={secondaryButtonStyle}>
            Next Puzzle
          </button>

          <p>{message}</p>
        </div>
      ) : (
        <p>No puzzles found. Add puzzles in Supabase first.</p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginTop: "20px",
};

const buttonStyle = {
  background: "#16a34a",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
