'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage('Check your email for the confirmation link! (Or if auto-confirm is on, you can now log in).');
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
        setMessage(`Error: ${error.message}`);
        setLoading(false);
      } else {
        // Success! Send them to the dashboard
        router.push('/dashboard'); 
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-writer-white p-4">
      <div className="bg-writer-beige/30 p-8 rounded-xl border border-writer-beige w-full max-w-sm">
        <h1 className="text-2xl font-bold text-writer-navy mb-6 text-center">Writer Login</h1>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:border-writer-navy"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:border-writer-navy"
        />
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleSignIn} disabled={loading}
            className="w-full bg-writer-navy text-white p-2 rounded hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
          >
            Sign In
          </button>
          <button 
            onClick={handleSignUp} disabled={loading}
            className="w-full bg-transparent border border-writer-navy text-writer-navy p-2 rounded hover:bg-writer-beige transition-colors disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-writer-brown">{message}</p>
        )}
      </div>
    </div>
  );
}