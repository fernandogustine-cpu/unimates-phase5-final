'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

const pieces = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

function fenToBoard(fen) {
  const position = fen.split(' ')[0];
  return position.split('/').map(row => {
    const squares = [];
    for (let char of row) {
      if (isNaN(char)) squares.push(char);
      else for (let i = 0; i < Number(char); i++) squares.push('');
    }
    return squares;
  });
}

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    const { data } = await supabase
      .from('puzzles')
      .select('*')
      .order('created_at', { ascending: false });

    setPuzzles(data || []);
  }

  if (puzzles.length === 0) {
    return (
      <Shell title="Puzzles">
        <h1>Uni-Mates Puzzle Trainer</h1>
        <p>No puzzles found.</p>
      </Shell>
    );
  }

  const puzzle = puzzles[current];
  const board = fenToBoard(puzzle.fen);

  function squareName(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return files[col] + (8 - row);
  }

  function handleSquareClick(row, col) {
    const square = squareName(row, col);

    if (!selected) {
      setSelected(square);
      setMessage(`Selected ${square}`);
      return;
    }

    const move = selected + square;
    const answer = (puzzle.answer || '').toLowerCase().replaceAll(' ', '');

    if (
      move.toLowerCase() === answer ||
      answer.includes(move.toLowerCase()) ||
      answer.includes(selected.toLowerCase()) ||
      answer.includes(square.toLowerCase())
    ) {
      setMessage('✅ Correct! Well done.');
      setScore(score + 10);
    } else {
      setMessage('❌ Try again.');
    }

    setSelected(null);
  }

  function nextPuzzle() {
    setCurrent((current + 1) % puzzles.length);
    setMessage('');
    setSelected(null);
  }

  return (
    <Shell title="Puzzles">
      <h1>Uni-Mates Puzzle Trainer</h1>
      <p>Solve tactical puzzles and improve your chess calculation.</p>

      <h2>{puzzle.title}</h2>
      <p><strong>Theme:</strong> {puzzle.theme}</p>
      <p><strong>Difficulty:</strong> {puzzle.difficulty}</p>
      <p><strong>Score:</strong> {score}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 60px)',
          width: '480px',
          border: '3px solid #222',
          marginTop: '20px'
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const dark = (rowIndex + colIndex) % 2 === 1;
            const square = squareName(rowIndex, colIndex);

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                style={{
                  width: '60px',
                  height: '60px',
                  background: selected === square ? '#facc15' : dark ? '#769656' : '#eeeed2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '38px',
                  cursor: 'pointer'
                }}
              >
                {pieces[piece] || ''}
              </div>
            );
          })
        )}
      </div>

      <p style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }}>
        {message}
      </p>

      <button
        onClick={nextPuzzle}
        style={{
          background: '#2563eb',
          color: '#fff',
          padding: '10px 18px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Next Puzzle
      </button>
    </Shell>
  );
}
