"use client";

import { useEffect, useState } from "react";
import Shell from "../../components/Shell";
import { supabase } from "../../lib/supabaseClient";

export default function CoursesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setItems(data || []);
  }

  return (
    <Shell title="Courses">
      <h1>Courses</h1>
      <p>Uni-Mates Chess Academy training courses.</p>

      {items.map((course) => (
        <div
          key={course.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2>{course.title}</h2>

          <p>
            <strong>Level:</strong> {course.level || "Not set"}
          </p>

          <p>
            <strong>Description:</strong>
          </p>

          <p>{course.description}</p>

          <button
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Enroll Now
          </button>
        </div>
      ))}
    </Shell>
  );
}
