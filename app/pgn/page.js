'use client';

import { useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function PGNPage() {
  const [pgn,setPgn] = useState('');
  const [notes,setNotes] = useState('');

  async function savePGN(e){
    e.preventDefault();
    const { error } = await supabase.from('pgn_games').insert([{ pgn, coach_notes: notes || 'Needs Coach Fernando review.' }]);
    if (error) return alert(error.message);
    alert('PGN saved to Supabase');
    setPgn('');
    setNotes('');
  }

  return (
    <Shell title="PGN Analysis">
      <form className="form" onSubmit={savePGN}>
        <textarea placeholder="Paste PGN here" value={pgn} onChange={e=>setPgn(e.target.value)} />
        <textarea placeholder="Coach Fernando notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        <button>Save PGN</button>
      </form>
    </Shell>
  );
}
