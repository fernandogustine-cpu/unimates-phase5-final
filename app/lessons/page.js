"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setLessons(data);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lessons</h1>

      {lessons.map((lesson) => (
        <div key={lesson.id} style={{ marginBottom: "30px" }}>
          <h2>{lesson.title}</h2>

          {lesson.content_url && (
            <iframe
              width="560"
              height="315"
              src={lesson.content_url.replace("watch?v=", "embed/")}
              title={lesson.title}
              allowFullScreen
            />
          )}

          <p>{lesson.lesson_text}</p>
        </div>
      ))}
    </div>
  );
}
