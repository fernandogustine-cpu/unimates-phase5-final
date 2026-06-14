"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("created_at");

    if (data) setLessons(data);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chess Lessons</h1>

      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h2>{lesson.title}</h2>

          <p>{lesson.lesson_text}</p>

          {lesson.lesson_type === "video" && (
            <a
              href={lesson.content_url}
              target="_blank"
              rel="noreferrer"
            >
              Watch Lesson
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
