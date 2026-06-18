"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    rating: "",
    level: "",
    school: "",
    parent_name: "",
    parent_phone: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error loading students: " + error.message);
      return;
    }

    setStudents(data || []);
  }

  async function addStudent(e) {
    e.preventDefault();

    if (!form.full_name || !form.email) {
      alert("Please enter student name and email.");
      return;
    }

    const { error } = await supabase.from("student_profiles").insert([
      {
        full_name: form.full_name,
        email: form.email,
        rating: form.rating ? Number(form.rating) : null,
        level: form.level,
        school: form.school,
        parent_name: form.parent_name,
        parent_phone: form.parent_phone,
      },
    ]);

    if (error) {
      alert("Error adding student: " + error.message);
      return;
    }

    setForm({
      full_name: "",
      email: "",
      rating: "",
      level: "",
      school: "",
      parent_name: "",
      parent_phone: "",
    });

    fetchStudents();
    alert("Student added successfully!");
  }

  async function deleteStudent(id) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("student_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting student: " + error.message);
      return;
    }

    fetchStudents();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Students & Profiles</h1>
      <p>Coach Fernando training system powered by Supabase.</p>

      <form onSubmit={addStudent} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Rating"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Level"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="School"
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Parent name"
          value={form.parent_name}
          onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Parent phone"
          value={form.parent_phone}
          onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Add Student
        </button>
      </form>

      <h2>Student List</h2>

      {students.length === 0 && <p>No students added yet.</p>}

      {students.map((student) => (
        <div key={student.id} style={cardStyle}>
          <h3>{student.full_name}</h3>
          <p>Email: {student.email}</p>
          <p>Rating: {student.rating || "N/A"}</p>
          <p>Level: {student.level || "N/A"}</p>
          <p>School: {student.school || "N/A"}</p>
          <p>Parent: {student.parent_name || "N/A"}</p>
          <p>Phone: {student.parent_phone || "N/A"}</p>

          <button
            onClick={() => deleteStudent(student.id)}
            style={deleteButtonStyle}
          >
            Delete Student
          </button>
        </div>
      ))}
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
  background: "#d4a017",
  color: "black",
  padding: "12px 18px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteButtonStyle = {
  background: "#b91c1c",
  color: "white",
  padding: "10px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardStyle = {
  padding: "18px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff",
};
