"use client";

import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PuzzleTrainer() {
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*");

    if (!error && data) {
      setPuzzles(data);

      if (data.length > 0) {
        const chess = new Chess(data[0].fen);
        setGame(chess);
      }
    }
  }

  function loadNextPuzzle() {
    const next = currentIndex + 1;

    if (next >= puzzles.length) {
      setMessage("🎉 All puzzles completed!");
      return;
    }

    setCurrentIndex(next);

    const chess = new Chess(puzzles[next].fen);
    setGame(chess);

    setMessage("");
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const puzzle = puzzles[currentIndex];

    const movePlayed =
      sourceSquare + targetSquare;

    const solution =
      puzzle.answer.toLowerCase().replace(/[+#]/g, "");

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    const newGame = new Chess(game.fen());
    setGame(newGame);

    const playedSAN = move.san
      .toLowerCase()
      .replace(/[+#]/g, "");

    if (
      playedSAN === solution ||
      move.to === solution.slice(-2)
    ) {
      setMessage("✅ Correct! +10 Points");
      setScore((s) => s + 10);

      setTimeout(() => {
        loadNextPuzzle();
      }, 2000);
    } else {
      setMessage("❌ Try Again");

      setTimeout(() => {
        const reset = new Chess(
          puzzle.fen
        );
        setGame(reset);
      }, 1000);
    }

    return true;
  }

  if (puzzles.length === 0) {
    return <div>Loading puzzles...</div>;
  }

  const puzzle = puzzles[currentIndex];

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Uni-Mates Puzzle Trainer</h1>

      <h2>{puzzle.title}</h2>

      <p>
        <strong>Theme:</strong> {puzzle.theme}
      </p>

      <p>
        <strong>Difficulty:</strong>{" "}
        {puzzle.difficulty}
      </p>

      <p>
        <strong>Score:</strong> {score}
      </p>

      <div
        style={{
          width: "500px",
          maxWidth: "100%",
        }}
      >
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
        />
      </div>

      {message && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={loadNextPuzzle}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Next Puzzle
      </button>
    </div>
  );
}
