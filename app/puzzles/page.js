"use client";

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { createClient } from "@supabase/supabase-js";
import Shell from "../components/Shell";

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

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      setMessage("Could not load puzzles.");
      return;
    }

    if (data && data.length > 0) {
      setPuzzles(data);
      setCurrentIndex(0);

      try {
        setGame(new Chess(data[0].fen));
      } catch {
        setMessage("Invalid FEN in first puzzle.");
      }
    }
  }

  function normalizeMove(move) {
    return String(move || "")
      .toLowerCase()
      .replace(/[+#x!?]/g, "")
      .trim();
  }

  async function saveAttempt(puzzle, submittedAnswer, isCorrect) {
    await supabase.from("puzzle_attempts").insert({
      puzzle_id: puzzle.id,
      student_name: "Guest Student",
      move_played: submittedAnswer,
      is_correct: isCorrect,
    });
  }

  async function onDrop(sourceSquare, targetSquare) {
    const puzzle = puzzles[currentIndex];
    if (!puzzle) return false;

    const tempGame = new Chess(game.fen());

    const move = tempGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    const playedMove = normalizeMove(move.san);
    const correctMove = normalizeMove(puzzle.answer);

    const isCorrect =
      playedMove === correctMove ||
      normalizeMove(move.from + move.to) === correctMove ||
      normalizeMove(move.to) === correctMove.slice(-2);

    if (isCorrect) {
      setGame(tempGame);
      setScore((oldScore) => oldScore + 10);
      setMessage("✅ Correct! Well done.");

      await saveAttempt(puzzle, move.san, true);

      setTimeout(() => {
        loadNextPuzzle();
      }, 1500);
    } else {
      setMessage("❌ Try again.");

      await saveAttempt(puzzle, move.san, false);

      setTimeout(() => {
        try {
          setGame(new Chess(puzzle.fen));
        } catch {
          setMessage("Invalid puzzle FEN.");
        }
      }, 1000);
    }

    return true;
  }

  function loadNextPuzzle() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= puzzles.length) {
      setMessage("🎉 Well done! You completed all puzzles.");
      return;
    }

    const nextPuzzle = puzzles[nextIndex];

    setCurrentIndex(nextIndex);
    setMessage("");

    try {
      setGame(new Chess(nextPuzzle.fen));
    } catch {
      setMessage("Invalid FEN in this puzzle.");
    }
  }

  if (puzzles.length === 0) {
    return (
      <Shell title="Puzzle Trainer" subtitle="Coach Fernando training system">
        <h1>Puzzle Trainer</h1>
        <p>No puzzles found. Add puzzles in Supabase first.</p>
      </Shell>
    );
  }

  const puzzle = puzzles[currentIndex];

  return (
    <Shell title="Puzzle Trainer" subtitle="Coach Fernando training system">
      <div style={{ padding: "20px" }}>
        <h1>Puzzle Trainer</h1>

        <h2>{puzzle.title || "Chess Puzzle"}</h2>

        <p>
          <strong>Theme:</strong> {puzzle.theme || "General"}
        </p>

        <p>
          <strong>Difficulty:</strong> {puzzle.difficulty || "Beginner"}
        </p>

        <p>
          <strong>Score:</strong> {score}
        </p>

        <div style={{ width: "520px", maxWidth: "100%", marginTop: "20px" }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardWidth={500}
          />
        </div>

        {message && (
          <p
            style={{
              marginTop: "18px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <button
          onClick={loadNextPuzzle}
          style={{
            marginTop: "16px",
            background: "#2563eb",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Next Puzzle
        </button>
      </div>
    </Shell>
  );
}
