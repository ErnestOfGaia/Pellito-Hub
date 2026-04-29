'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      const { role } = await res.json();
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Invalid credentials — check with your manager');
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚓</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pellito Hub</h1>
          <p className="text-slate-400 mt-1 text-sm">Pelican Brewery · Kitchen Training</p>
        </div>

        {/* Card */}
        <div className="bg-amber-50 rounded-2xl shadow-2xl p-6">
          <h2 className="text-slate-800 font-semibold text-lg mb-5">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                placeholder="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                placeholder="password"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-base transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Pellito the Deckhand · Pelican Brewery, Pacific City OR
        </p>
      </div>
    </main>
  );
}
