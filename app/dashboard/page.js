'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const [counts,setCounts] = useState({profiles:0,courses:0,puzzles:0,tournaments:0});

  useEffect(()=>{ loadCounts(); },[]);

  async function loadCounts(){
    const tables = ['profiles','courses','puzzles','tournaments'];
    const next = {};
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      next[table] = count || 0;
    }
    setCounts(next);
  }

  return (
    <Shell title="Dashboard">
      <div className="stats">
        <div className="stat"><h3>{counts.profiles}</h3><p>Profiles</p></div>
        <div className="stat"><h3>{counts.courses}</h3><p>Courses</p></div>
        <div className="stat"><h3>{counts.puzzles}</h3><p>Puzzles</p></div>
        <div className="stat"><h3>{counts.tournaments}</h3><p>Tournaments</p></div>
      </div>
      <div className="card">
        <h3>Today’s Training Plan</h3>
        <ol>
          <li>10 warm-up tactics</li>
          <li>Opening review</li>
          <li>One annotated model game</li>
          <li>Endgame conversion practice</li>
        </ol>
      </div>
    </Shell>
  );
}
