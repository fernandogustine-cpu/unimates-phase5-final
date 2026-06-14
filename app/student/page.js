"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);

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
  }

  if (!profile) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {profile.full_name}</h1>

      <p><strong>Rating:</strong> {profile.rating}</p>

      <p><strong>Goal:</strong> {profile.goal}</p>
    </div>
  );
}
