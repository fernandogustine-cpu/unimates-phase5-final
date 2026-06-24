"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PGNLibraryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    pgn_text: "",
  });

  useEffect(() => {
    loadPGNs();
  }, []);

  async function loadPGNs() {
    const { data } = await supabase
      .from("pgn_library")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  async function addPGN(e) {
    e.preventDefault();

    const { error } = await supabase.from("pgn_library").insert(form);

    if (error) {
      alert("Error adding PGN: " + error.message);
      return;
    }

    setForm({ title: "", category: "", pgn_text: "" });
    loadPGNs();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>PGN Library</h1>
      <p>Upload and store Coach Fernando training PGNs.</p>

      <form onSubmit={addPGN} style={cardStyle}>
        <input
          placeholder="PGN title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
          required
        />

        <input
          placeholder="Category e.g. French Defence, Jobava, Tactics"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        />

        <textarea
          placeholder="Paste PGN here"
          value={form.pgn_text}
          onChange={(e) => setForm({ ...form, pgn_text: e.target.value })}
          style={{ ...inputStyle, minHeight: "180px" }}
          required
        />

        <button style={buttonStyle}>Save PGN</button>
      </form>

      {items.map((item) => (
        <div key={item.id} style={cardStyle}>
          <h2>{item.title}</h2>
          <p><strong>Category:</strong> {item.category || "General"}</p>
          <pre style={pgnBox}>{item.pgn_text}</pre>
        </div>
      ))}
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
