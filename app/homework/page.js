"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomeworkPage() {
  const [students, setStudents] = useState([]);
  const [homework, setHomework] = useState([]);
  const [form, setForm] = useState({
    student_name: "",
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    loadStudents();
    loadHomework();
  }, []);

  async function loadStudents() {
    const { data } = await supabase
      .from("students")
      .select("full_name")
      .order("full_name");

    setStudents(data || []);
  }

  async function loadHomework() {
    const { data } = await supabase
      .from("student_homework")
      .select("*")
      .order("created_at", { ascending: false });

    setHomework(data || []);
  }

  async function addHomework(e) {
    e.preventDefault();

    if (!form.student_name || !form.title) {
      alert("Please choose a student and add a homework title.");
      return;
    }

    const { error } = await supabase.from("student_homework").insert(form);

    if (error) {
      alert("Error adding homework: " + error.message);
      return;
    }

    setForm({
      student_name: "",
      title: "",
      description: "",
      due_date: "",
    });

    loadHomework();
  }

  async function markCompleted(id) {
    await supabase
      .from("student_homework")
      .update({ status: "Completed" })
      .eq("id", id);

    loadHomework();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Coach Fernando Homework Assignments</h1>
      <p>Assign homework to specific Uni-Mates students.</p>

      <form onSubmit={addHomework} style={cardStyle}>
        <select
          value={form.student_name}
          onChange={(e) =>
            setForm({ ...form, student_name: e.target.value })
          }
          style={inputStyle}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.full_name} value={s.full_name}>
              {s.full_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Homework title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
        />

        <textarea
          placeholder="Homework description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          style={inputStyle}
        />

        <button style={buttonStyle}>Assign Homework</button>
      </form>

      <h2>Assigned Homework</h2>

      {homework.map((item) => (
        <div key={item.id} style={cardStyle}>
          <h3>{item.title}</h3>
          <p><strong>Student:</strong> {item.student_name}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Due Date:</strong> {item.due_date || "No date"}</p>
          <p><strong>Status:</strong> {item.status}</p>

          {item.status !== "Completed" && (
            <button onClick={() => markCompleted(item.id)} style={greenButton}>
              Mark Completed
            </button>
          )}
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

const greenButton = {
  background: "#16a34a",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
};
