"use client";

import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");

  function loginStudent(e) {
    e.preventDefault();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    localStorage.setItem("student_name", name);
    window.location.href = "/student";
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Uni-Mates Student Login</h1>
      <p>Enter your full name exactly as Coach Fernando added it.</p>

      <form onSubmit={loginStudent}>
        <input
          placeholder="Example: Kganya Sehularo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <button
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
