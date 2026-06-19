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

    if (error) {
      alert("Error loading courses: " + error.message);
      return;
    }

    setCourses(data || []);
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

  function enrollCourse(course) {
    alert(`Enrollment coming soon for: ${course.title}`);
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
          style={inputStyle}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Level: Beginner, Intermediate, Advanced"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={goldButton}>
          Add Course
        </button>
      </form>

      <div>
        {courses.map((course) => (
          <div key={course.id} style={cardStyle}>
            <h2>{course.title}</h2>

            <p>
              <strong>Level:</strong> {course.level || "N/A"}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <p>{course.description || "No description added yet."}</p>

            <button onClick={() => enrollCourse(course)} style={blueButton}>
              Enroll Now
            </button>
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

const cardStyle = {
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "white",
};

const goldButton = {
  background: "#d4a017",
  color: "black",
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const blueButton = {
  background: "#2563eb",
  color: "white",
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
