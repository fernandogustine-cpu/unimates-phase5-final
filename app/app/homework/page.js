'use client';

import Shell from '../../components/Shell';

export default function HomeworkPage() {
  return (
    <Shell title="Homework">
      <div className="card">
        <h2>Assigned Homework</h2>

        <div className="card">
          <h3>Solve 20 Fork Puzzles</h3>
          <p>Due: 21 June 2026</p>
          <p>Status: Assigned</p>
        </div>

        <div className="card">
          <h3>Study Outposts Chapter 1</h3>
          <p>Due: 21 June 2026</p>
          <p>Status: Assigned</p>
        </div>

        <div className="card">
          <h3>Analyse Carlsen vs Anand</h3>
          <p>Due: 28 June 2026</p>
          <p>Status: Assigned</p>
        </div>
      </div>
    </Shell>
  );
}
