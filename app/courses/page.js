"use client";

import { useEffect, useState } from "react";
import Shell from "../../components/Shell";
import { supabase } from "../../lib/supabaseClient";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setCourses(data || []);
    }
  }

  return (
    <Shell title="Courses">
      <div style={{ padding: "20px" }}>
        <h1>Uni-Mates Chess Academy Courses</h1>

        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: "#fff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >
            <h2>{course.title}</h2>

            <p>
              <strong>Level:</strong>{" "}
              {course.level || "Beginner"}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <p>{course.description}</p>

            <button
              style={{
                marginTop: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </Shell>
  );
}
