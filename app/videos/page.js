'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function VideosPage() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ title:'', lesson_type:'video', content_url:'', lesson_text:'' });

  useEffect(()=>{ loadItems(); },[]);

  async function loadItems(){
    const { data, error } = await supabase.from('lessons').select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
  }

  async function addItem(e){
    e.preventDefault();
    const { error } = await supabase.from('lessons').insert([form]);
    if (error) return alert(error.message);
    setForm({ title:'', lesson_type:'video', content_url:'', lesson_text:'' });
    loadItems();
  }

  return (
    <Shell title="Video Lessons">
      <form className="form" onSubmit={addItem}>
        <input placeholder="Lesson title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input placeholder="YouTube/video link" value={form.content_url} onChange={e=>setForm({...form,content_url:e.target.value})} />
        <input placeholder="Category" value={form.lesson_text} onChange={e=>setForm({...form,lesson_text:e.target.value})} />
        <button>Add Video</button>
      </form>
      <div className="grid">
        {items.map(item => (
          <div className="card" key={item.id}>
            <h3>{item.title}</h3><p>{item.lesson_text}</p><a href={item.content_url} target="_blank">Open video</a>
          </div>
        ))}
      </div>
    </Shell>
  );
}
