'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function PuzzlesPage() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ title:'', fen:'', question:'', answer:'', theme:'', difficulty:1 });

  useEffect(()=>{ loadItems(); },[]);

  async function loadItems(){
    const { data, error } = await supabase.from('puzzles').select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
  }

  async function addItem(e){
    e.preventDefault();
    const { error } = await supabase.from('puzzles').insert([form]);
    if (error) return alert(error.message);
    setForm({ title:'', fen:'', question:'', answer:'', theme:'', difficulty:1 });
    loadItems();
  }

  return (
    <Shell title="Puzzle Trainer">
      <form className="form" onSubmit={addItem}>
        <input placeholder="Puzzle title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea placeholder="FEN or position description" value={form.fen} onChange={e=>setForm({...form,fen:e.target.value})} />
        <input placeholder="Question" value={form.question} onChange={e=>setForm({...form,question:e.target.value})} />
        <input placeholder="Correct answer" value={form.answer} onChange={e=>setForm({...form,answer:e.target.value})} />
        <input placeholder="Theme" value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})} />
        <button>Add Puzzle</button>
      </form>
      <div className="grid">
        {items.map(item => (
          <div className="card" key={item.id}>
            <h3>{item.title}</h3><p>{item.theme}</p><p>{item.question}</p><pre>{item.fen}</pre>
          </div>
        ))}
      </div>
    </Shell>
  );
}
