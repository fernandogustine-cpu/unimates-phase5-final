"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", userData.user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Dashboard</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>{profile.full_name}</h2>

        <p>
          <strong>Rating:</strong> {profile.rating}
        </p>

        <p>
          <strong>Goal:</strong> {profile.goal}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Training Progress</h2>

        <p>Lessons Completed: 2</p>

        <p>Homework Completed: 0</p>

        <p>Puzzle Score: 0</p>
      </div>
    </div>
  );
}
