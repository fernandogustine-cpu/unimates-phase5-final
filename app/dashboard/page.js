'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('full_name', 'Kganya Sehularo')
      .single();

    setStudent(studentData);

    if (studentData) {
      const { data: progressData } = await supabase
        .from('course_progress')
        .select('*')
        .eq('student_id', studentData.id);

      setProgress(progressData || []);
    }
  }

  return (
    <Shell title="Student Dashboard">
      {student && (
        <>
          <div className="grid">
            <div className="stat">
              <h3>{student.rating}</h3>
              <p>Current Rating</p>
            </div>
            <div className="stat">
              <h3>2000</h3>
              <p>Goal Rating</p>
            </div>
            <div className="stat">
              <h3>1450</h3>
              <p>Puzzle Score</p>
            </div>
            <div className="stat">
              <h3>2</h3>
              <p>Homework Due</p>
            </div>
          </div>

          <div className="card">
            <h2>{student.full_name}</h2>
            <p>Age: {student.age}</p>
            <p>School: {student.school}</p>
            <p>Coach: Fernando Nyirenda</p>
          </div>

          <div className="card">
            <h2>Course Progress</h2>

            {progress.map((item) => (
              <div key={item.id} style={{ marginBottom: '18px' }}>
                <strong>{item.course_title}</strong>
                <p>{item.progress}% complete</p>

                <div style={{
                  width: '100%',
                  background: '#ddd',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.progress}%`,
                    background: '#f5b700',
                    padding: '8px',
                    color: '#000',
                    fontWeight: 'bold'
                  }}>
                    {item.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
