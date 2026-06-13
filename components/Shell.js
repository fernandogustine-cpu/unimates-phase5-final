import Sidebar from './Sidebar';

export default function Shell({ children, title }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <div className="header">
          <h2>{title}</h2>
          <p>Coach Fernando training system powered by Supabase.</p>
        </div>
        {children}
      </main>
    </div>
  );
}
