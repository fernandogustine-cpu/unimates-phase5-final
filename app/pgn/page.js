"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PGNLibraryPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pgnText, setPgnText] = useState("");

  useEffect(() => {
    loadPGNs();
  }, []);

  async function loadPGNs() {
    const { data, error } = await supabase
      .from("pgn_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error loading PGNs: " + error.message);
      return;
    }

    setItems(data || []);
  }

  async function addPGN(e) {
    e.preventDefault();

    const { error } = await supabase.from("pgn_library").insert([
      {
        title: title,
        category: category,
        pgn: pgnText,
        pgn_text: pgnText,
        player_name: "Coach Fernando",
        opponent_name: "Training Game",
        coach_notes: "",
      },
    ]);

    if (error) {
      alert("Error adding PGN: " + error.message);
      return;
    }

    alert("PGN saved successfully!");

    setTitle("");
    setCategory("");
    setPgnText("");

    loadPGNs();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>PGN Library</h1>
      <p>Upload and store Coach Fernando training PGNs.</p>

      <form onSubmit={addPGN} style={cardStyle}>
        <input
          placeholder="PGN title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          placeholder="Category e.g. French Defence, Jobava, Tactics"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Paste PGN here"
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          style={{ ...inputStyle, minHeight: "180px" }}
          required
        />

        <button style={buttonStyle}>Save PGN</button>
      </form>

      <h2>Saved PGNs</h2>

      {items.length === 0 ? (
        <p>No PGNs saved yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h2>{item.title}</h2>
            <p>
              <strong>Category:</strong> {item.category || "General"}
            </p>
            <p>
              <strong>Player:</strong> {item.player_name || "Coach Fernando"}
            </p>
            <p>
              <strong>Opponent:</strong>{" "}
              {item.opponent_name || "Training Game"}
            </p>

            <pre style={pgnBox}>{item.pgn_text || item.pgn}</pre>
          </div>
        ))
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const cardStyle = {
  background: "#fff",
  padding: "18px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const buttonStyle = {
  background: "#d97706",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
};

const pgnBox = {
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "8px",
  whiteSpace: "pre-wrap",
  overflowX: "auto",
};
