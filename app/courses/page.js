'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function CoursesPage() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ title:'', level:'Beginner', description:'' });

  useEffect(()=>{ loadItems(); },[]);

  async function loadItems(){
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
  }

  async function addItem(e){
    e.preventDefault();
    const { error } = await supabase.from('courses').insert([form]);
    if (error) return alert(error.message);
    setForm({ title:'', level:'Beginner', description:'' });
    loadItems();
  }

  return (
    <Shell title="Courses">
      <form className="form" onSubmit={addItem}>
        <input placeholder="Course title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
          <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Elite</option>
        </select>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <button>Add Course</button>
      </form>
      <div className="grid">
        {items.map(item => (
          <div className="card" key={item.id}>
            <h3>{item.title}</h3><p><strong>{item.level}</strong></p><p>{item.description}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
