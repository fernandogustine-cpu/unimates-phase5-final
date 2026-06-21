"use client";

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PuzzleTrainer() {
  const [puzzles, setPuzzles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const studentName = "Guest Student";

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("is_puzzle_of_day", { ascending: false })
      .order("rating", { ascending: true });

    if (error) {
      setMessage("Could not load puzzles: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      setPuzzles(data);
      setCurrentIndex(0);
      setGame(new Chess(data[0].fen));
    }
  }

  function cleanMove(move) {
    return String(move || "")
      .toLowerCase()
      .replace(/[+#x!?]/g, "")
      .trim();
  }

  async function saveAttempt(puzzle, movePlayed, isCorrect) {
    await supabase.from("puzzle_attempts").insert({
      puzzle_id: puzzle.id,
      student_name: studentName,
      move_played: movePlayed,
      is_correct: isCorrect,
    });

    const { data: existing } = await supabase
      .from("student_puzzle_stats")
      .select("*")
      .eq("student_name", studentName)
      .maybeSingle();

    if (!existing) {
      await supabase.from("student_puzzle_stats").insert({
        student_name: studentName,
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        current_streak: isCorrect ? 1 : 0,
        best_streak: isCorrect ? 1 : 0,
        total_score: isCorrect ? 10 : 0,
      });

      setStreak(isCorrect ? 1 : 0);
      setBestStreak(isCorrect ? 1 : 0);
    } else {
      const newStreak = isCorrect ? existing.current_streak + 1 : 0;
      const newBestStreak = Math.max(existing.best_streak, newStreak);

      await supabase
        .from("student_puzzle_stats")
        .update({
          total_attempts: existing.total_attempts + 1,
          correct_attempts: existing.correct_attempts + (isCorrect ? 1 : 0),
          current_streak: newStreak,
          best_streak: newBestStreak,
          total_score: existing.total_score + (isCorrect ? 10 : 0),
          last_played: new Date().toISOString(),
        })
        .eq("student_name", studentName);

      setStreak(newStreak);
      setBestStreak(newBestStreak);
    }
  }

  async function onDrop(sourceSquare, targetSquare) {
    const puzzle = puzzles[currentIndex];
    if (!puzzle) return false;

    const newGame = new Chess(game.fen());

    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    const playedSAN = cleanMove(move.san);
    const playedUCI = cleanMove(move.from + move.to);
    const correctAnswer = cleanMove(puzzle.answer || puzzle.solution);

    const isCorrect =
      playedSAN === correctAnswer ||
      playedUCI === correctAnswer;

    if (isCorrect) {
      setGame(newGame);
      setScore((oldScore) => oldScore + 10);
      setMessage("✅ Correct! Well done.");

      await saveAttempt(puzzle, move.san, true);

      setTimeout(() => {
        nextPuzzle();
      }, 1500);
    } else {
      setMessage("❌ Incorrect. Try again.");
      await saveAttempt(puzzle, move.san, false);

      setTimeout(() => {
        setGame(new Chess(puzzle.fen));
      }, 1000);
    }

    return true;
  }

  function nextPuzzle() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= puzzles.length) {
      setMessage("🎉 Well done! You completed all puzzles.");
      return;
    }

    const nextPuzzle = puzzles[nextIndex];
    setCurrentIndex(nextIndex);
    setGame(new Chess(nextPuzzle.fen));
    setMessage("");
  }

  if (puzzles.length === 0) {
    return (
      <div style={pageStyle}>
        <h1>Uni-Mates Puzzle Trainer</h1>
        <p>No puzzles found. Add puzzles in Supabase first.</p>
        {message && <p>{message}</p>}
      </div>
    );
  }

  const puzzle = puzzles[currentIndex];

  return (
    <div style={pageStyle}>
      <h1>Uni-Mates Puzzle Trainer</h1>

      {puzzle.is_puzzle_of_day && (
        <p style={{ fontWeight: "bold", color: "#d97706" }}>
          ⭐ Puzzle of the Day
        </p>
      )}

      <h2>{puzzle.title || "Training Puzzle"}</h2>

      <p><strong>Theme:</strong> {puzzle.theme || "Tactics"}</p>
      <p><strong>Difficulty:</strong> {puzzle.difficulty || "Beginner"}</p>
      <p><strong>Rating:</strong> {puzzle.rating || "800"}</p>
      <p><strong>Score:</strong> {score}</p>
      <p><strong>Current Streak:</strong> {streak}</p>
      <p><strong>Best Streak:</strong> {bestStreak}</p>

      <div style={{ width: "520px", maxWidth: "100%" }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={500}
        />
      </div>

      {message && (
        <p style={{ marginTop: "18px", fontSize: "20px", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <button onClick={nextPuzzle} style={buttonStyle}>
        Next Puzzle
      </button>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
};

const buttonStyle = {
  marginTop: "16px",
  background: "#2563eb",
  color: "white",
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
