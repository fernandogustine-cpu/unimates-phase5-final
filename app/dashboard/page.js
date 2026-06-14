"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudentProgress();
  }, []);

  async function loadStudentProgress() {
    const { data } = await supabase
      .from("coach_student_progress")
      .select("*")
      .order("full_name");

    setStudents(data || []);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Coach Dashboard</h1>
      <p>Student lesson progress overview.</p>

      <div style={{ marginTop: "25px" }}>
        {students.map((student) => (
          <div
            key={student.profile_id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>{student.full_name}</h2>
            <p>Rating: {student.rating}</p>
            <p>Completed Lessons: {student.completed_lessons}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
