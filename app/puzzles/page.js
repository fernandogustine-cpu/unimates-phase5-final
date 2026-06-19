"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    fen: "",
    question: "",
    answer: "",
    theme: "",
    difficulty: "",
  });

  useEffect(() => {
    fetchPuzzles();
  }, []);

  async function fetchPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPuzzles(data || []);
  }

  async function addPuzzle(e) {
    e.preventDefault();

    const { error } = await supabase.from("puzzles").insert({
      title: form.title,
      fen: form.fen,
      question: form.question,
      answer: form.answer,
      theme: form.theme,
      difficulty: Number(form.difficulty) || 1,
    });

    if (error) {
      alert("Error adding puzzle: " + error.message);
      return;
    }

    setForm({
      title: "",
      fen: "",
      question: "",
      answer: "",
      theme: "",
      difficulty: "",
    });

    fetchPuzzles();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Puzzle Trainer</h1>
      <p>Coach Fernando puzzle training system powered by Supabase.</p>

      <form onSubmit={addPuzzle} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Puzzle title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="FEN position"
          value={form.fen}
          onChange={(e) => setForm({ ...form, fen: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Correct answer e.g. Re8+"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Theme e.g. Back Rank Mate"
          value={form.theme}
          onChange={(e) => setForm({ ...form, theme: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Difficulty 1-5"
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Add Puzzle
        </button>
      </form>

      {puzzles.map((puzzle) => (
        <PuzzleCard key={puzzle.id} puzzle={puzzle} />
      ))}
    </div>
  );
}

function PuzzleCard({ puzzle }) {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  function checkAnswer() {
    const studentAnswer = answer.trim().toLowerCase();
    const correctAnswer = puzzle.answer.trim().toLowerCase();

    if (studentAnswer === correctAnswer) {
      setMessage("✅ Correct! Well done.");
    } else {
      setMessage("❌ Try again.");
    }
  }

  return (
    <div style={cardStyle}>
      <h2>{puzzle.title}</h2>

      <p>
        <strong>Theme:</strong> {puzzle.theme || "N/A"}
      </p>

      <p>
        <strong>Difficulty:</strong> {puzzle.difficulty || 1}
      </p>

      <p>
        <strong>FEN:</strong> {puzzle.fen}
      </p>

      <p>
        <strong>Question:</strong> {puzzle.question}
      </p>

      <input
        placeholder="Enter your move"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={inputStyle}
      />

      <button onClick={checkAnswer} style={buttonStyle}>
        Submit Answer
      </button>

      {message && <p style={{ fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  background: "#d4a017",
  color: "black",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "10px",
};

const cardStyle = {
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "white",
};
