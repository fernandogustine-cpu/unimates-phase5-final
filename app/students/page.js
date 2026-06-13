'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function StudentsPage() {
  const [profiles,setProfiles] = useState([]);

  useEffect(()=>{ loadProfiles(); },[]);

  async function loadProfiles(){
    const { data, error } = await supabase.from('profiles').select('*').order('created_at',{ascending:false});
    if (!error) setProfiles(data || []);
  }

  return (
    <Shell title="Students & Profiles">
      <div className="notice">
        Create login users in Supabase Authentication first. Then add their row in the profiles table with role: coach, student or parent.
      </div>
      <div className="card">
        {profiles.map(p=>(
          <div className="row" key={p.id}>
            <strong>{p.full_name}</strong>
            <span>{p.role}</span>
            <span>{p.goal}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
