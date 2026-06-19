"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtube_url: "",
    category: "",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setVideos(data || []);
  }

  async function addVideo(e) {
    e.preventDefault();

    const { error } = await supabase.from("videos").insert({
      title: form.title,
      description: form.description,
      youtube_url: form.youtube_url,
      category: form.category,
    });

    if (error) {
      alert("Error adding video: " + error.message);
      return;
    }

    setForm({
      title: "",
      description: "",
      youtube_url: "",
      category: "",
    });

    fetchVideos();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Videos</h1>
      <p>Coach Fernando video training library powered by Supabase.</p>

      <form onSubmit={addVideo} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Video title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="YouTube or ChessFactor URL"
          value={form.youtube_url}
          onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
          required
          style={inputStyle}
        />

        <input
          placeholder="Category: Beginner, Tactics, Endgame, Openings"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Add Video
        </button>
      </form>

      <div>
        {videos.map((video) => (
          <div key={video.id} style={cardStyle}>
            <h2>{video.title}</h2>

            <p>
              <strong>Category:</strong> {video.category || "General"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {video.description || "No description added yet."}
            </p>

            <a
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const buttonStyle = {
  background: "#d89b00",
  color: "black",
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardStyle = {
  padding: "20px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "white",
};

const linkStyle = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "10px 15px",
  borderRadius: "6px",
  textDecoration: "none",
};
