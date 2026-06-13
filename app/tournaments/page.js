'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function TournamentsPage() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ name:'', venue:'', start_date:'' });

  useEffect(()=>{ loadItems(); },[]);

  async function loadItems(){
    const { data, error } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
    if (!error) setItems(data || []);
  }

  async function addItem(e){
    e.preventDefault();
    const { error } = await supabase.from('tournaments').insert([form]);
    if (error) return alert(error.message);
    setForm({ name:'', venue:'', start_date:'' });
    loadItems();
  }

  return (
    <Shell title="Tournaments">
      <form className="form" onSubmit={addItem}>
        <input placeholder="Tournament name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} />
        <input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} />
        <button>Add Tournament</button>
      </form>
      <div className="grid">
        {items.map(item => (
          <div className="card" key={item.id}>
            <h3>{item.name}</h3><p>{item.venue}</p><p>{item.start_date}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
