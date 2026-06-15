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
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            background: "white",
          }}
        >
          <h2>{course.title}</h2>
          <p>
            <strong>Category:</strong> {course.category}
          </p>
          <p>{course.description}</p>
        </div>
      ))}
    </Shell>
  );
}
