"use client";

import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { createClient } from "@supabase/supabase-js";
import Shell from "../../components/Shell";

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      setPuzzles(data);
      setCurrentIndex(0);
      setGame(new Chess(data[0].fen));
    }
  }

  function normalizeMove(move) {
    return String(move || "")
      .toLowerCase()
      .replace(/[+#x=]/g, "")
      .trim();
  }

  function onDrop(sourceSquare, targetSquare) {
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

    if (playedMove === correctMove || move.to === correctMove.slice(-2)) {
      setGame(tempGame);
      setScore((oldScore) => oldScore + 10);
      setMessage("✅ Correct! +10 points");

      setTimeout(() => {
        loadNextPuzzle();
      }, 1500);
    } else {
      setMessage("❌ Try again");

      setTimeout(() => {
        setGame(new Chess(puzzle.fen));
        setMessage("");
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
    setGame(new Chess(nextPuzzle.fen));
    setMessage("");
  }

  if (puzzles.length === 0) {
    return (
      <Shell title="Puzzles" subtitle="Coach Fernando training system powered by Supabase.">
        <h1>Uni-Mates Puzzle Trainer</h1>
        <p>Loading puzzles...</p>
      </Shell>
    );
  }

  const puzzle = puzzles[currentIndex];

  return (
    <Shell title="Puzzles" subtitle="Coach Fernando training system powered by Supabase.">
      <div style={{ maxWidth: "900px" }}>
        <h1>Uni-Mates Puzzle Trainer</h1>
        <p>Solve tactical puzzles and improve your chess calculation.</p>

        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            marginTop: "20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <h2>{puzzle.title}</h2>

          <p>
            <strong>Theme:</strong> {puzzle.theme}
          </p>

          <p>
            <strong>Difficulty:</strong> {puzzle.difficulty}
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
      </div>
    </Shell>
  );
}
