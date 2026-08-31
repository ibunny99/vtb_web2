'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_logged_in', 'true');
        router.push('/admin');
      } else {
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1217] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-[#161B24] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(0,220,255,0.12)] border border-[rgba(0,220,255,0.3)] text-[#00DCFF] font-heading font-extrabold text-xl mb-4">
            VTB
          </div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            VTB Admin Portal
          </h1>
          <p className="text-xs text-white/50 mt-1">
            VTB Roleplay Website Management CMS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username..."
              className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00DCFF]/60 transition-colors"
            />
          </div>

          <div>
            <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00DCFF]/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00DCFF] hover:bg-[#52F0FF] text-black font-heading font-extrabold uppercase text-sm rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
