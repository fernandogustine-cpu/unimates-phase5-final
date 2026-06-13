import Link from 'next/link';

export default function Home() {
  return (
    <main className="main">
      <div className="header">
        <h1>Uni-Mates Chess Academy</h1>
        <p>Professional online chess training platform for students, coaches and parents.</p>
        <Link href="/login"><button>Enter Portal</button></Link>
      </div>
      <div className="grid">
        <div className="card"><h3>Student Accounts</h3><p>Login, lessons, homework and puzzle tracking.</p></div>
        <div className="card"><h3>Coach Dashboard</h3><p>Create courses, lessons, puzzles, tournaments and reports.</p></div>
        <div className="card"><h3>PGN Analysis</h3><p>Upload games and add Coach Fernando improvement notes.</p></div>
      </div>
    </main>
  );
}
