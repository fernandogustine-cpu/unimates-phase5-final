"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("youtube.com/embed/")) return url;

  let videoId = "";

  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtube_url: "",
    category: "",
    level: "",
    course: "",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error loading videos: " + error.message);
      return;
    }

    setVideos(data || []);
  }

  async function addVideo(e) {
    e.preventDefault();

    const { error } = await supabase.from("videos").insert({
      title: form.title,
      description: form.description,
      youtube_url: form.youtube_url,
      category: form.category,
      level: form.level,
      course: form.course,
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
      level: "",
      course: "",
    });

    fetchVideos();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Videos</h1>
      <p>Coach Fernando video training library powered by Supabase.</p>

      <form onSubmit={addVideo} style={{ marginBottom: "30px" }}>
        <input placeholder="Video title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
        <input placeholder="YouTube URL" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} required style={inputStyle} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input placeholder="Level: Beginner, Intermediate, Advanced" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} style={inputStyle} />
        <input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} style={inputStyle} />

        <button type="submit" style={buttonStyle}>Add Video</button>
      </form>

      {videos.map((video) => {
        const embedUrl = getYouTubeEmbedUrl(video.youtube_url);

        return (
          <div key={video.id} style={cardStyle}>
            <h2>{video.title}</h2>
            <p><strong>Level:</strong> {video.level || "N/A"}</p>
            <p><strong>Course:</strong> {video.course || "N/A"}</p>
            <p>{video.description || "No description added."}</p>

            {embedUrl && (
              <iframe
                width="100%"
                height="400"
                src={embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ borderRadius: "12px", marginTop: "15px" }}
              ></iframe>
            )}

            <a
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              style={youtubeButtonStyle}
            >
              Watch on YouTube
            </a>
          </div>
        );
      })}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  background: "#d99a00",
  color: "white",
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const youtubeButtonStyle = {
  display: "inline-block",
  marginTop: "12px",
  background: "#cc0000",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};
