'use client';

import React, { useState, useEffect } from 'react';

interface ServerStatus {
  name: string;
  current: number;
  max: number;
  active: boolean;
}

interface FeatureCard {
  title: string;
  description: string;
  videoSrc?: string;
  photoSrc?: string;
}

interface StatItem {
  value: string;
  suffix: string;
  label: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function AdminFullHomeEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'servers' | 'about' | 'stats' | 'faqs'>('hero');

  // Hero fields
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [heroDescription, setHeroDescription] = useState('');

  // Servers
  const [servers, setServers] = useState<ServerStatus[]>([]);

  // About & Features
  const [aboutTitle, setAboutTitle] = useState('');
  const [features, setFeatures] = useState<FeatureCard[]>([]);

  // Stats Section
  const [statsTitle, setStatsTitle] = useState('');
  const [statsDescription, setStatsDescription] = useState('');
  const [statsList, setStatsList] = useState<StatItem[]>([]);

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          // Home & Stats
          setHeroTitle1(d.data.home?.heroTitle1 || 'Nhập vai đỉnh cao');
          setHeroTitle2(d.data.home?.heroTitle2 || 'Cổ điển - Tôn trọng');
          setHeroDescription(
            d.data.home?.heroDescription ||
              'VTB RP starts with you. A world built from the ground up...'
          );
          setAboutTitle(d.data.home?.aboutTitle || 'Familiar. Reimagined!');

          setStatsTitle(d.data.home?.statsTitle || 'What We Achieved Last Season');
          setStatsDescription(
            d.data.home?.statsDescription ||
              'Thousands of players, hundreds of thousands of hours, and half a million items — here is what our community built together.'
          );

          // Servers
          setServers(
            d.data.servers || [
              { name: 'VTB RP - S1', current: 542, max: 666, active: true },
              { name: 'VTB RP - VIP', current: 180, max: 300, active: true },
            ]
          );

          // Features
          setFeatures(
            d.data.features || [
              {
                title: 'The City is Yours to Break',
                description: 'Sabotage businesses, pull off high octane heists...',
                videoSrc: 'https://cdn.prodigyrp.net/website-content/The_City_Is_Yours_To_Break.webm',
              },
            ]
          );

          // Stats List
          setStatsList(
            d.data.statsList || [
              { value: '15', suffix: ' K players', label: 'Unique Players' },
              { value: '500', suffix: ' K hrs', label: 'Total Playtime' },
              { value: '666', suffix: ' Peak', label: 'Peak Players' },
              { value: '2.5', suffix: ' m msgs', label: 'Sent messages in Phone' },
            ]
          );

          // FAQs
          setFaqs(
            d.data.faqs || [
              {
                id: 1,
                question: 'Làm thế nào để gia nhập máy chủ Horizon Roleplay?',
                answer: 'Tham gia máy chủ Discord chính thức của Horizon Roleplay và nộp đơn Whitelist.',
              },
            ]
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Server helpers
  const handleAddServer = () => {
    setServers([...servers, { name: 'New Server', current: 0, max: 300, active: true }]);
  };
  const handleRemoveServer = (index: number) => {
    setServers(servers.filter((_, i) => i !== index));
  };
  const handleServerChange = (index: number, field: keyof ServerStatus, value: any) => {
    const updated = [...servers];
    updated[index] = { ...updated[index], [field]: value };
    setServers(updated);
  };

  // Feature helpers
  const handleAddFeature = () => {
    setFeatures([
      ...features,
      { title: 'Tiêu đề tính năng', description: 'Mô tả chi tiết...', videoSrc: '', photoSrc: '' },
    ]);
  };
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  const handleFeatureChange = (index: number, field: keyof FeatureCard, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  // Stats helpers
  const handleAddStat = () => {
    setStatsList([...statsList, { value: '100', suffix: '+', label: 'Tên chỉ số' }]);
  };
  const handleRemoveStat = (index: number) => {
    setStatsList(statsList.filter((_, i) => i !== index));
  };
  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    const updated = [...statsList];
    updated[index] = { ...updated[index], [field]: value };
    setStatsList(updated);
  };

  // FAQ helpers
  const handleAddFaq = () => {
    const nextId = faqs.length > 0 ? Math.max(...faqs.map((f) => f.id || 0)) + 1 : 1;
    setFaqs([...faqs, { id: nextId, question: 'Câu hỏi mới?', answer: 'Câu trả lời...' }]);
  };
  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };
  const handleFaqChange = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  // Save handler
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home: {
            heroTitle1,
            heroTitle2,
            heroDescription,
            aboutTitle,
            statsTitle,
            statsDescription,
          },
          servers,
          features,
          statsList,
          faqs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✓ Đã lưu toàn bộ thay đổi Trang Chủ & Thống Kê thành công!');
      } else {
        setMessage('✕ Lỗi khi lưu dữ liệu.');
      }
    } catch (err) {
      setMessage('✕ Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white font-heading">Đang tải toàn bộ dữ liệu Trang Chủ...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase text-white tracking-tight">
          Quản Lý Toàn Bộ Trang Chủ (Home CMS)
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Chỉnh sửa đầy đủ 100%: Hero Banner, Server Statuses, Features, Stats Thống Kê, và FAQ.
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

      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase transition-all ${
            activeTab === 'hero'
              ? 'bg-[#00DCFF] text-black shadow-lg'
              : 'bg-[#161B24] text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          1. Hero Banner
        </button>

        <button
          onClick={() => setActiveTab('servers')}
          className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase transition-all ${
            activeTab === 'servers'
              ? 'bg-[#00DCFF] text-black shadow-lg'
              : 'bg-[#161B24] text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          2. Servers ({servers.length})
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase transition-all ${
            activeTab === 'about'
              ? 'bg-[#00DCFF] text-black shadow-lg'
              : 'bg-[#161B24] text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          3. Features & About ({features.length})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase transition-all ${
            activeTab === 'stats'
              ? 'bg-[#00DCFF] text-black shadow-lg'
              : 'bg-[#161B24] text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          4. Stats Thống Kê ({statsList.length})
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase transition-all ${
            activeTab === 'faqs'
              ? 'bg-[#00DCFF] text-black shadow-lg'
              : 'bg-[#161B24] text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          5. FAQs Giải Đáp ({faqs.length})
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Tab 1: Hero Banner */}
        {activeTab === 'hero' && (
          <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-heading text-lg font-bold uppercase text-[#00DCFF] border-b border-white/10 pb-3">
              Chỉnh Sửa Hero Banner
            </h2>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Tiêu đề chính dòng 1
              </label>
              <input
                type="text"
                value={heroTitle1}
                onChange={(e) => setHeroTitle1(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Tiêu đề chính dòng 2 (Highlight Glow)
              </label>
              <input
                type="text"
                value={heroTitle2}
                onChange={(e) => setHeroTitle2(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Mô tả ngắn Hero Section
              </label>
              <textarea
                rows={4}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Server Statuses */}
        {activeTab === 'servers' && (
          <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-[#00DCFF]">
                Quản Lý Trạng Thái Cụm Máy Chủ
              </h2>
              <button
                type="button"
                onClick={handleAddServer}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase rounded-lg transition-colors"
              >
                + Thêm Server
              </button>
            </div>

            <div className="space-y-4">
              {servers.map((server, idx) => (
                <div key={idx} className="bg-[#11151b] border border-white/10 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold uppercase text-[#00DCFF]">
                      Cụm Server #{idx + 1}
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={server.active}
                          onChange={(e) => handleServerChange(idx, 'active', e.target.checked)}
                          className="accent-[#00DCFF]"
                        />
                        <span className="text-xs text-white/70">Hoạt động (Active)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveServer(idx)}
                        className="text-xs text-red-400 hover:text-red-300 font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Tên Cụm Server
                      </label>
                      <input
                        type="text"
                        value={server.name}
                        onChange={(e) => handleServerChange(idx, 'name', e.target.value)}
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Người Chơi Đang Online
                      </label>
                      <input
                        type="number"
                        value={server.current}
                        onChange={(e) =>
                          handleServerChange(idx, 'current', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Tối Đa Slot (Max)
                      </label>
                      <input
                        type="number"
                        value={server.max}
                        onChange={(e) =>
                          handleServerChange(idx, 'max', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: About & Features */}
        {activeTab === 'about' && (
          <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-[#00DCFF]">
                Quản Lý Tính Năng & About Section
              </h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase rounded-lg transition-colors"
              >
                + Thêm Card Tính Năng
              </button>
            </div>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Tiêu đề About Section
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-heading text-sm font-bold uppercase text-white/80">
                Danh sách Feature Cards
              </h3>

              {features.map((feat, idx) => (
                <div key={idx} className="bg-[#11151b] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-[#00DCFF]">
                      Card #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      Xóa Card
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                      Tên tính năng
                    </label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                      Mô tả tính năng
                    </label>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                      Đường dẫn Video (.webm) (Nếu không có video, hệ thống sẽ tự dùng Hình Ảnh bên dưới)
                    </label>
                    <input
                      type="text"
                      value={feat.videoSrc || ''}
                      onChange={(e) => handleFeatureChange(idx, 'videoSrc', e.target.value)}
                      placeholder="https://.../video.webm (Có thể để trống)"
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono mb-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-[#00DCFF] mb-1">
                      Đường dẫn Hình Ảnh (PhotoSrc) (Dùng khi không có Video)
                    </label>
                    <input
                      type="text"
                      value={feat.photoSrc || ''}
                      onChange={(e) => handleFeatureChange(idx, 'photoSrc', e.target.value)}
                      placeholder="/assets/images/photo.png hoặc https://.../image.jpg"
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Stats Section */}
        {activeTab === 'stats' && (
          <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-[#00DCFF]">
                Quản Lý Thống Kê Chỉ Số (Stats Section)
              </h2>
              <button
                type="button"
                onClick={handleAddStat}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase rounded-lg transition-colors"
              >
                + Thêm Thống Kê
              </button>
            </div>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Tiêu đề Stats Section (Heading)
              </label>
              <input
                type="text"
                value={statsTitle}
                onChange={(e) => setStatsTitle(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-bold uppercase text-white/70 mb-2">
                Mô tả ngắn Stats Section
              </label>
              <textarea
                rows={3}
                value={statsDescription}
                onChange={(e) => setStatsDescription(e.target.value)}
                className="w-full bg-[#11151b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DCFF]/60"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-heading text-sm font-bold uppercase text-white/80">
                Danh sách các chỉ số
              </h3>

              {statsList.map((stat, idx) => (
                <div key={idx} className="bg-[#11151b] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-[#00DCFF]">
                      Chỉ số #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      Xóa Chỉ Số
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Giá trị (Value)
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        placeholder="VD: 15, 500, 666..."
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Hậu tố / Đơn vị (Suffix)
                      </label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                        placeholder="VD:  K players,  K hrs..."
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                        Tên nhãn (Label)
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="VD: Unique Players..."
                        className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === 'faqs' && (
          <div className="bg-[#161B24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-[#00DCFF]">
                Quản Lý Câu Hỏi Thường Gặp (FAQs)
              </h2>
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase rounded-lg transition-colors"
              >
                + Thêm Câu Hỏi FAQ
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#11151b] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-[#00DCFF]">
                      FAQ #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      Xóa FAQ
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                      Câu Hỏi (Question)
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-white/60 mb-1">
                      Câu Trả Lời (Answer)
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                      className="w-full bg-[#161B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-4 bg-[#00DCFF] hover:bg-[#b5ee70] text-black font-heading font-bold uppercase text-sm rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Đang Lưu Tất Cả...' : 'Lưu Tất Cả Thay Đổi Trang Chủ'}
        </button>
      </form>
    </div>
  );
}
