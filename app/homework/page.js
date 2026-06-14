'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function HomeworkPage() {
  const [homework, setHomework] = useState([]);

  useEffect(() => {
    loadHomework();
  }, []);

  async function loadHomework() {
    const { data } = await supabase
      .from('homework')
      .select('*')
      .order('due_date');

    setHomework(data || []);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Homework</h1>

      {homework.map((item) => (
        <div key={item.id} style={{ marginBottom: '20px' }}>
          <h3>{item.title}</h3>
          <p>{item.instructions}</p>
          <p>Due: {item.due_date}</p>
          <p>Status: {item.status}</p>
        </div>
      ))}
    </div>
  );
}
