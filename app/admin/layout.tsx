'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If on /admin/login page, bypass auth check
    if (pathname === '/admin/login') {
      setAuthenticated(true);
      return;
    }

    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      setAuthenticated(false);
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    localStorage.removeItem('admin_logged_in');
    router.push('/admin/login');
  };

  // If on login page, render child directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F1217] flex items-center justify-center text-white font-heading">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin', icon: '📊' },
    { label: 'Shop Products CMS', href: '/admin/shop', icon: '🛍️' },
    { label: 'Orders List (Đơn Hàng)', href: '/admin/orders', icon: '📦' },
    { label: 'Home Page CMS', href: '/admin/home', icon: '🏠' },
    { label: 'Rules CMS', href: '/admin/rules', icon: '📜' },
    { label: 'Applications CMS', href: '/admin/applications', icon: '⏳' },
    { label: 'Ref Codes CMS', href: '/admin/refcode', icon: '🎁' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1217] text-white flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#161B24] border-r border-white/10 flex-shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[rgba(0,220,255,0.12)] border border-[rgba(0,220,255,0.3)] text-[#00DCFF] font-heading font-extrabold text-lg flex items-center justify-center">
              VTB
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                VTB Admin CMS
              </h2>
              <span className="text-[10px] text-[#00DCFF] font-mono">v1.0 Online</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-xs font-bold uppercase transition-all duration-150 ${
                    active
                      ? 'bg-[#00DCFF] text-black shadow-[0_0_12px_rgba(0,220,255,0.25)]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>🌐 Xem Website công cộng</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <span>🚪 Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
