import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{fontSize: 42}}>♟</div>
      <h1>Uni-Mates</h1>
      <p>Chess Academy Pro</p>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/students">Students</Link>
      <Link href="/courses">Courses</Link>
      <Link href="/videos">Videos</Link>
      <Link href="/puzzles">Puzzles</Link>
  <Link href="/homework">Homework</Link>
    <Link href="/lessons">Lessons</Link>  
  <Link href="/pgn">PGN Analysis</Link>
      <Link href="/tournaments">Tournaments</Link>
      <Link href="/login">Login</Link>
    </aside>
  );
}
