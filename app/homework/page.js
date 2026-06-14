"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function HomeworkPage() {
  const [homework, setHomework] = useState([]);
  const [completed, setCompleted] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    start();
  }, []);

  async function start() {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData?.user;

    setUser(currentUser);

    await loadHomework();

    if (currentUser) {
      await loadProgress(currentUser.id);
    }
  }

  async function loadHomework() {
    const { data } = await supabase
      .from("homework")
      .select("*")
      .order("due_date");

    setHomework(data || []);
  }

  async function loadProgress(userId) {
    const { data } = await supabase
      .from("homework_submissions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true);

    const done = {};

    (data || []).forEach((item) => {
      done[item.homework_id] = true;
    });

    setCompleted(done);
  }

  async function markComplete(homeworkId) {
    if (!user) {
      alert("Please login first");
      return;
    }

    await supabase.from("homework_submissions").insert({
      user_id: user.id,
      homework_id: homeworkId,
      completed: true,
      completed_at: new Date().toISOString()
    });

    setCompleted({
      ...completed,
      [homeworkId]: true
    });
  }

  const completedCount = Object.keys(completed).length;
  const totalHomework = homework.length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Homework</h1>

      <h3>
        Homework Completed: {completedCount}/{totalHomework}
      </h3>

      {homework.map((item) => (
        <div
          key={item.id}
          style={{
            marginBottom: "25px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px"
          }}
        >
          <h2>{item.title}</h2>

          <p>{item.description}</p>

          <p>
            <strong>Due:</strong> {item.due_date}
          </p>

          {completed[item.id] ? (
            <strong style={{ color: "green" }}>
              ✓ Homework Submitted
            </strong>
          ) : (
            <button onClick={() => markComplete(item.id)}>
              Submit Homework
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
