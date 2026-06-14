"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    loadLessons();
    loadProgress();
  }, []);

  async function loadLessons() {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: false });

    setLessons(data || []);
  }

  async function loadProgress() {
    const { data } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("completed", true);

    const done = {};
    (data || []).forEach((item) => {
      done[item.lesson_id] = true;
    });

    setCompleted(done);
  }

  async function markComplete(lessonId) {
    await supabase.from("lesson_progress").insert({
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    });

    setCompleted({ ...completed, [lessonId]: true });
  }

  const completedCount = Object.keys(completed).length;
  const totalLessons = lessons.length;
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lessons</h1>

      <h3>Course Progress: {progress}%</h3>
      <p>
        Completed: {completedCount}/{totalLessons}
      </p>

      {lessons.map((lesson) => (
        <div key={lesson.id} style={{ marginBottom: "35px" }}>
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

          {completed[lesson.id] ? (
            <strong style={{ color: "green" }}>✓ Completed</strong>
          ) : (
            <button onClick={() => markComplete(lesson.id)}>
              Mark Lesson Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
