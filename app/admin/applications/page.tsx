'use client';

import React, { useState, useEffect } from 'react';

export default function AdminApplicationsEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data && d.data.applications) {
          setIsOpen(d.data.applications.isOpen || false);
          setTargetDate(
            d.data.applications.targetDate
              ? new Date(d.data.applications.targetDate).toISOString().slice(0, 16)
              : ''
          );
          setStatusMessage(d.data.applications.statusMessage || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applications: {
            isOpen,
            targetDate: targetDate ? new Date(targetDate).toISOString() : new Date().toISOString(),
            statusMessage,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✓ Cập nhật trạng thái cổng đăng ký thành công!');
      } else {
        setMessage('✕ Lỗi khi lưu.');
      }
    } catch (err) {
      setMessage('✕ Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white font-heading">Đang tải cài đặt ứng tuyển...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase text-white tracking-tight">
          Quản Lý Cổng Đăng Ký (Applications)
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Cài đặt ngày đếm ngược mở cổng Whitelist hoặc đổi trạng thái mở nhận đơn.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl font-heading text-xs font-bold ${
            message.startsWith('✓')
              ? 'bg-[rgba(213,254,152,0.15)] border border-[#00DCFF]/40 text-[#00DCFF]'
              : 'bg-red-500/15 border border-red-500/40 text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-heading text-base font-bold uppercase text-[#00DCFF]">
              Trạng Thái Cổng Đăng Ký
            </h2>
            <p className="text-xs text-white/50">Bật/Tắt mở nhận đơn Whitelist</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="w-5 h-5 accent-[#00DCFF]"
            />
            <span className="font-heading text-xs font-bold uppercase text-white">
              {isOpen ? 'Mở Nhận Đơn' : 'Đang Đếm Ngược (Coming Soon)'}
            </span>
          </label>
        </div>

        <div>
          <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
            Thời gian Mở Đơn (Dùng cho Đồng Hồ Đếm Ngược dd:hh:mm:ss)
          </label>
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
          />
        </div>

        <div>
          <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
            Thông điệp trạng thái (Status Message)
          </label>
          <textarea
            rows={3}
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-[#00DCFF] hover:bg-[#b5ee70] text-black font-heading font-bold uppercase text-sm rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi Cổng Đăng Ký'}
        </button>
      </form>
    </div>
  );
}
