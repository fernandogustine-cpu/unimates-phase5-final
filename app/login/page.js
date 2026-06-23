"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StudentPortal() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [homework, setHomework] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      alert("Student loading error: " + error.message);
      return;
    }

    setStudents(data || []);

    const savedName = localStorage.getItem("student_name");

    if (savedName) {
      openStudentPortal(savedName, data || []);
    }
  }

  async function openStudentPortal(name, studentList = students) {
    setSelectedStudent(name);

    const student = studentList.find((s) => s.full_name === name);
    setStudentData(student || null);

    const { data: homeworkData } = await supabase
      .from("student_homework")
      .select("*")
      .eq("student_name", name);

    setHomework(homeworkData || []);

    const { data: attemptData } = await supabase
      .from("puzzle_attempts")
      .select("*")
      .eq("student_name", name);

    setAttempts(attemptData || []);
  }

  function logout() {
    localStorage.removeItem("student_name");
    window.location.href = "/login";
  }

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.is_correct === true).length;
  const puzzleScore = correctAttempts * 10;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Uni-Mates Student Portal</h1>
      <p>View homework, puzzle scores, rating and progress.</p>

      <button onClick={logout} style={logoutButton}>
        Logout
      </button>

      <select
        value={selectedStudent}
        onChange={(e) => openStudentPortal(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Student</option>

        {students.map((student) => (
          <option key={student.id} value={student.full_name}>
            {student.full_name}
          </option>
        ))}
      </select>

      {studentData && (
        <>
          <div style={cardStyle}>
            <h2>{studentData.full_name}</h2>
            <p><strong>Age:</strong> {studentData.age || "N/A"}</p>
            <p><strong>School:</strong> {studentData.school || "N/A"}</p>
            <p><strong>Rating:</strong> {studentData.rating || "N/A"}</p>
            <p><strong>Coach:</strong> {studentData.coach_name || "Coach Fernando"}</p>
          </div>

          <h2>My Puzzle Progress</h2>

          <div style={gridStyle}>
            <div style={smallCardStyle}>
              <h3>Total Score</h3>
              <p>{puzzleScore}</p>
            </div>

            <div style={smallCardStyle}>
              <h3>Total Attempts</h3>
              <p>{totalAttempts}</p>
            </div>

            <div style={smallCardStyle}>
              <h3>Correct Answers</h3>
              <p>{correctAttempts}</p>
            </div>

            <div style={smallCardStyle}>
              <h3>Accuracy</h3>
              <p>{accuracy}%</p>
            </div>
          </div>

          <h2>My Homework</h2>

          {homework.length === 0 ? (
            <p>No homework assigned yet.</p>
          ) : (
            homework.map((item) => (
              <div key={item.id} style={cardStyle}>
                <h3>{item.title || item.homework_title}</h3>
                <p>
                  <strong>Description:</strong>{" "}
                  {item.description || item.homework_description || "No description"}
                </p>
                <p><strong>Due Date:</strong> {item.due_date || "No date"}</p>
                <p><strong>Status:</strong> {item.status || "Pending"}</p>
              </div>
            ))
          )}

          <h2>Recent Puzzle Attempts</h2>

          {attempts.length === 0 ? (
            <p>No puzzle attempts yet.</p>
          ) : (
            attempts.slice(-10).reverse().map((attempt) => (
              <div key={attempt.id} style={cardStyle}>
                <p>
                  <strong>Answer:</strong>{" "}
                  {attempt.submitted_answer || attempt.move_played || "N/A"}
                </p>
                <p>
                  <strong>Correct:</strong>{" "}
                  {attempt.is_correct ? "Yes" : "No"}
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "18px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const smallCardStyle = {
  background: "#f9fafb",
  padding: "16px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "25px",
};

const logoutButton = {
  background: "#dc2626",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  marginBottom: "15px",
};
