"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    status: "Upcoming",
  });

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*");

    if (error) {
      alert("Error loading tournaments: " + error.message);
      return;
    }

    setTournaments(data || []);
  }

  async function addTournament(e) {
    e.preventDefault();

    if (!form.title || !form.date || !form.venue) {
      alert("Please complete title, date and venue.");
      return;
    }

    const { error } = await supabase.from("tournaments").insert(form);

    if (error) {
      alert("Error adding tournament: " + error.message);
      return;
    }

    setForm({
      title: "",
      date: "",
      venue: "",
      status: "Upcoming",
    });

    loadTournaments();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏆 Uni-Mates Tournament Calendar</h1>
      <p>Add and view upcoming chess tournaments.</p>

      <form onSubmit={addTournament} style={cardStyle}>
        <input
          placeholder="Tournament title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={inputStyle}
        >
          <option>Upcoming</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <button style={buttonStyle}>Add Tournament</button>
      </form>

      <h2>Upcoming Events</h2>

      {tournaments.length === 0 ? (
        <p>No tournaments added yet.</p>
      ) : (
        tournaments.map((event) => (
          <div key={event.id} style={cardStyle}>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Status:</strong> {event.status}</p>
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
