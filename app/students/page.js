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

    if (!error) setStudents(data || []);
  }

  async function addStudent(e) {
    e.preventDefault();

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
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Students & Profiles</h1>
      <p>Coach Fernando training system powered by Supabase.</p>

      <form onSubmit={addStudent} style={{ marginBottom: "30px" }}>
        <input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        <input placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        <input placeholder="School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
        <input placeholder="Parent name" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
        <input placeholder="Parent phone" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />

        <button type="submit">Add Student</button>
      </form>

      {students.map((student) => (
        <div key={student.id} style={{ padding: "15px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>{student.full_name}</h3>
          <p>{student.email}</p>
          <p>Rating: {student.rating || "N/A"}</p>
          <p>Level: {student.level || "N/A"}</p>
          <p>School: {student.school || "N/A"}</p>
          <p>Parent: {student.parent_name || "N/A"}</p>
          <p>Phone: {student.parent_phone || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
