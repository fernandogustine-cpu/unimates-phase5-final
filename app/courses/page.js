"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCourses(data || []);
  }

  async function addCourse(e) {
    e.preventDefault();

    const { error } = await supabase.from("courses").insert({
      title: form.title,
      description: form.description,
      level: form.level,
    });

    if (error) {
      alert("Error adding course: " + error.message);
      return;
    }

    setForm({
      title: "",
      description: "",
      level: "",
    });

    fetchCourses();
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Courses</h1>
      <p>Coach Fernando course management system powered by Supabase.</p>

      <form onSubmit={addCourse} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Level e.g Beginner, Intermediate, Advanced"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        />

        <button type="submit">Add Course</button>
      </form>

      {courses.map((course) => (
        <div
          key={course.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>
            <strong>Level:</strong> {course.level || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}
