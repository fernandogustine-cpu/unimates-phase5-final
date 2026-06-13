'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');

  async function signIn(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);
    router.push('/dashboard');
  }

  async function signUp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMessage(error.message);
    setMessage('Account created. Check email if confirmation is enabled.');
  }

  return (
    <main className="main">
      <div className="form">
        <h1>Uni-Mates Login</h1>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Create Student Account</button>
        {message && <p className="notice">{message}</p>}
      </div>
    </main>
  );
}
