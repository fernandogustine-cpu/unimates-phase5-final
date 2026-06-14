'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
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

    if (data) setHomework(data);
  }

  return (
    <Shell>
      <h1>Homework</h1>

      {homework.map((item) => (
        <div
          key={item.id}
          style={{
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '10px'
          }}
        >
          <h3>{item.title}</h3>

          <p>{item.instructions}</p>

          <p>
            <strong>Due:</strong> {item.due_date}
          </p>

          <p>
            <strong>Status:</strong> {item.status}
          </p>
        </div>
      ))}
    </Shell>
  );
}
