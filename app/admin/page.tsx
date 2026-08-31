'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.data);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#161B24] border border-[rgba(0,220,255,0.3)] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-heading font-bold uppercase text-[#00DCFF] tracking-widest">
            Control Panel Overview
          </span>
          <h1 className="text-3xl font-heading font-extrabold uppercase text-white tracking-tight mt-1 mb-2">
            Welcome to VTB Roleplay CMS
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Manage home page content, server rules, applications whitelist countdown, and ref codes.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-heading font-bold uppercase text-white/40">
            FiveM Servers Status
          </span>
          <div className="text-3xl font-heading font-bold text-[#00DCFF] mt-2">
            {data?.servers?.length || 2} Servers
          </div>
          <span className="text-xs text-white/50 block mt-1">Realtime status active</span>
        </div>

        <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-heading font-bold uppercase text-white/40">
            Total Server Rules
          </span>
          <div className="text-3xl font-heading font-bold text-[#00DCFF] mt-2">
            {data?.rules?.length || 32} Rules
          </div>
          <span className="text-xs text-white/50 block mt-1">Ready to manage & edit</span>
        </div>

        <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-heading font-bold uppercase text-white/40">
            Applications Whitelist
          </span>
          <div className="text-2xl font-heading font-bold text-white mt-2">
            {data?.applications?.isOpen ? (
              <span className="text-cyan-400">✓ Portal Open</span>
            ) : (
              <span className="text-amber-400">⏳ Countdown Active</span>
            )}
          </div>
          <span className="text-xs text-white/50 block mt-1">Configure launch date & timer</span>
        </div>
      </div>

      {/* Quick Links / Shortcut Cards */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold uppercase text-white">Management Shortcuts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/home"
            className="group bg-[#161B24] border border-white/10 hover:border-[#00DCFF]/40 rounded-2xl p-6 transition-all hover:scale-[1.01]"
          >
            <div className="text-2xl mb-3">🏠</div>
            <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#00DCFF] transition-colors mb-1">
              Home Page CMS
            </h3>
            <p className="text-xs text-white/60">
              Edit Hero section, server player counts, features, and about content.
            </p>
          </Link>

          <Link
            href="/admin/rules"
            className="group bg-[#161B24] border border-white/10 hover:border-[#00DCFF]/40 rounded-2xl p-6 transition-all hover:scale-[1.01]"
          >
            <div className="text-2xl mb-3">📜</div>
            <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#00DCFF] transition-colors mb-1">
              Server Rules CMS
            </h3>
            <p className="text-xs text-white/60">
              Add new rules, edit NVL, RDM, VDM guidelines, and rule categories.
            </p>
          </Link>

          <Link
            href="/admin/applications"
            className="group bg-[#161B24] border border-white/10 hover:border-[#00DCFF]/40 rounded-2xl p-6 transition-all hover:scale-[1.01]"
          >
            <div className="text-2xl mb-3">⏳</div>
            <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#00DCFF] transition-colors mb-1">
              Applications CMS
            </h3>
            <p className="text-xs text-white/60">
              Configure Whitelist countdown date, target Google Form / Discord URLs.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
