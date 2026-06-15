'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState([]);

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from('puzzles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setPuzzles(data || []);
    }
  }

  return (
    <Shell title="Puzzles">
      <h1>Uni-Mates Puzzle Trainer</h1>
      <p>Solve tactical puzzles and improve your chess calculation.</p>

      {puzzles.map((puzzle) => (
        <div
          key={puzzle.id}
          style={{
            background: '#fff',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <h2>{puzzle.title}</h2>

          <p>
            <strong>Theme:</strong> {puzzle.theme || 'Training'}
          </p>

          <p>
            <strong>Difficulty:</strong> {puzzle.difficulty}
          </p>

          <p>
            <strong>FEN:</strong>
          </p>

          <div
            style={{
              background: '#f4f4f4',
              padding: '10px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}
          >
            {puzzle.fen}
          </div>

          <p style={{ marginTop: '15px' }}>
            <strong>Answer:</strong> {puzzle.answer}
          </p>
        </div>
      ))}
    </Shell>
  );
}
