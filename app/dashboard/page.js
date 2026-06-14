'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: authData } = await supabase.auth.getUser();
    const loggedUser = authData?.user;

    if (!loggedUser) return;

    setUser(loggedUser);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loggedUser.id)
      .single();

    setProfile(profileData);

    if (profileData?.role === 'student') {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('full_name', profileData.full_name)
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
  }

  if (!user) {
    return (
      <Shell title="Dashboard">
        <div className="card">
          <h2>Please login first.</h2>
          <p>Use your student or coach account to view your dashboard.</p>
        </div>
      </Shell>
    );
  }

  if (profile?.role === 'coach') {
    return (
      <Shell title="Coach Dashboard">
        <div className="grid">
          <div className="stat">
            <h3>{profile.full_name}</h3>
            <p>Coach</p>
          </div>
          <div className="stat">
            <h3>{profile.rating || 0}</h3>
            <p>Coach Rating</p>
          </div>
        </div>

        <div className="card">
          <h2>Welcome Coach Fernando</h2>
          <p>You can manage students, courses, videos, puzzles, PGN analysis and tournaments.</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Student Dashboard">
      {student ? (
        <>
          <div className="grid">
            <div className="stat">
              <h3>{student.rating || 0}</h3>
              <p>Current Rating</p>
            </div>
            <div className="stat">
              <h3>{student.goal_rating || 2000}</h3>
              <p>Goal Rating</p>
            </div>
            <div className="stat">
              <h3>{student.puzzle_score || 0}</h3>
              <p>Puzzle Score</p>
            </div>
            <div className="stat">
              <h3>{student.homework_due || 0}</h3>
              <p>Homework Due</p>
            </div>
          </div>

          <div className="card">
            <h2>{student.full_name}</h2>
            <p>Age: {student.age}</p>
            <p>School: {student.school}</p>
            <p>Coach: {student.coach_name || 'Fernando Nyirenda'}</p>
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
      ) : (
        <div className="card">
          <h2>No student profile found.</h2>
          <p>Make sure this user exists in both profiles and students tables with the same full name.</p>
        </div>
      )}
    </Shell>
  );
}
