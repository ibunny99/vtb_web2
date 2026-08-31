'use client';

import React, { useState, useEffect, useMemo } from 'react';
import LottieRefcodePlayer from '@/components/refcode/LottieRefcodePlayer';
import {
  RefcodeItem,
  calculateRefcodeGeometry,
  slugifyRefcode,
  AVAILABLE_FONTS,
} from '@/lib/refcode-lottie';
import {
  Plus,
  Trash2,
  Save,
  Sparkles,
  Check,
  RefreshCw,
  Copy,
  ExternalLink,
  Edit3,
  Search,
  Database,
  X,
  Gift,
  CheckSquare,
  Square,
  Eye,
  Sliders,
  Tv,
  Type,
  Palette,
  Radio,
} from 'lucide-react';

const BOX_COLOR_PRESETS = [
  { name: 'Cyan Horizon (Gốc)', value: '#00DCFF' },
  { name: 'Neon Lime', value: '#00DCFF' },
  { name: 'Gold VIP', value: '#FFD700' },
  { name: 'Cyber Purple', value: '#A855F7' },
  { name: 'Crimson Red', value: '#FF4466' },
  { name: 'Pure White', value: '#FFFFFF' },
];

const TEXT_COLOR_PRESETS = [
  { name: 'Đen (Gốc)', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Cyan Neon', value: '#00DCFF' },
  { name: 'Vàng Gold', value: '#FFD700' },
  { name: 'Xanh Neon', value: '#00DCFF' },
  { name: 'Đỏ Neon', value: '#FF3366' },
];

const SAMPLE_REFCODES: RefcodeItem[] = [
  {
    id: 'ref-1',
    code: 'Ibunny',
    slug: 'ibunny',
    title: 'REFCODE',
    owner: 'Ibunny',
    reward: 'Starter Pack + $50,000 in-game cash & VIP Starter Vehicle / កញ្ចប់ចាប់ផ្តើម + $50,000 និងរថយន្ត VIP',
    targetUrl: 'https://discord.gg/vtbrp',
    boxColor: '#00DCFF',
    textColor: '#000000',
    titleColor: '#FFFFFF',
    codeFont: '1FTV VIP Sakana',
    titleFont: '1FTV VIP Sakana',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ref-2',
    code: 'TUWCOR',
    slug: 'tuwcor',
    title: 'SPECIAL CODE',
    owner: 'Tuwcor',
    reward: 'VIP Founder Pack + Exclusive In-Game Title / កញ្ចប់ VIP Founder + ងារពិសេស',
    targetUrl: 'https://discord.gg/vtbrp',
    boxColor: '#00DCFF',
    textColor: '#000000',
    titleColor: '#FFFFFF',
    codeFont: '1FTV VIP Sakana',
    titleFont: '1FTV VIP Sakana',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ref-3',
    code: 'VTB2026',
    slug: 'vtb2026',
    title: 'STARTER CODE',
    owner: 'VTB Roleplay Server',
    reward: '$100,000 cash + Premium Citizen Card / $100,000 ប្រាក់សុទ្ធ + ប័ណ្ណពលរដ្ឋ Premium',
    targetUrl: 'https://discord.gg/vtbrp',
    boxColor: '#00DCFF',
    textColor: '#000000',
    titleColor: '#FFFFFF',
    codeFont: '1FTV VIP Sakana',
    titleFont: '1FTV VIP Sakana',
    createdAt: new Date().toISOString(),
  },
];

export default function AdminRefcodeCMSPage() {
  const [refcodes, setRefcodes] = useState<RefcodeItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'obs-guide'>('list');

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);

  // Form Fields for Editor
  const [formCode, setFormCode] = useState('Ibunny');
  const [formSlug, setFormSlug] = useState('ibunny');
  const [formTitle, setFormTitle] = useState('REFCODE');
  const [formOwner, setFormOwner] = useState('Ibunny');
  const [formReward, setFormReward] = useState('Gói quà khởi đầu + 50.000$ in-game');
  const [formTargetUrl, setFormTargetUrl] = useState('https://discord.gg/horizonrp');
  const [formBoxColor, setFormBoxColor] = useState('#00DCFF');
  const [formTextColor, setFormTextColor] = useState('#000000');
  const [formTitleColor, setFormTitleColor] = useState('#FFFFFF');
  const [formCodeFont, setFormCodeFont] = useState('1FTV VIP Sakana');
  const [formTitleFont, setFormTitleFont] = useState('1FTV VIP Sakana');
  const [previewTransparent, setPreviewTransparent] = useState(true);

  // Status & Notifications
  const [dataSource, setDataSource] = useState<string>('local');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live geometry metrics calculation for current form
  const liveGeometry = useMemo(() => {
    return calculateRefcodeGeometry(formCode, 120, formCodeFont);
  }, [formCode, formCodeFont]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (json.success) {
        if (json.source) setDataSource(json.source);
        const list: RefcodeItem[] = json.data?.refcodes || [];
        if (list.length > 0) {
          setRefcodes(list);
          if (!selectedId) selectItem(list[0]);
        } else {
          setRefcodes(SAMPLE_REFCODES);
          if (!selectedId) selectItem(SAMPLE_REFCODES[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching refcodes:', err);
      setRefcodes(SAMPLE_REFCODES);
      if (!selectedId) selectItem(SAMPLE_REFCODES[0]);
    } finally {
      setLoading(false);
    }
  }

  const selectItem = (item: RefcodeItem, switchTab = false) => {
    setSelectedId(item.id);
    setFormCode(item.code || 'Ibunny');
    setFormSlug(item.slug || slugifyRefcode(item.code));
    setFormTitle(item.title || 'REFCODE');
    setFormOwner(item.owner || '');
    setFormReward(item.reward || '');
    setFormTargetUrl(item.targetUrl || 'https://discord.gg/horizonrp');
    setFormBoxColor(item.boxColor || '#00DCFF');
    setFormTextColor(item.textColor || '#000000');
    setFormTitleColor(item.titleColor || '#FFFFFF');
    setFormCodeFont(item.codeFont || '1FTV VIP Sakana');
    setFormTitleFont(item.titleFont || '1FTV VIP Sakana');
    if (switchTab) setActiveTab('editor');
  };

  const startCreateNew = () => {
    const newId = `ref-${Date.now()}`;
    const defaultCode = `CODE${Math.floor(Math.random() * 9000 + 1000)}`;
    setSelectedId(newId);
    setFormCode(defaultCode);
    setFormSlug(slugifyRefcode(defaultCode));
    setFormTitle('REFCODE');
    setFormOwner('Đối Tác Mới');
    setFormReward('Quà tặng tân thủ 50.000$ + Xe VIP');
    setFormTargetUrl('https://discord.gg/horizonrp');
    setFormBoxColor('#00DCFF');
    setFormTextColor('#000000');
    setFormTitleColor('#FFFFFF');
    setFormCodeFont('1FTV VIP Sakana');
    setFormTitleFont('1FTV VIP Sakana');
    setActiveTab('editor');
  };

  const handleCodeChange = (val: string) => {
    setFormCode(val);
    const autoSlug = slugifyRefcode(val);
    setFormSlug(autoSlug);
  };

  // Save to API / Database
  const handleSaveAll = async (listToSave: RefcodeItem[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refcodes: listToSave,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRefcodes(listToSave);
        setToastMessage('Đã lưu danh sách Ref Code thành công!');
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert(json.message || 'Lỗi khi lưu dữ liệu');
      }
    } catch (err) {
      console.error('Error saving refcodes:', err);
      alert('Lỗi kết nối máy chủ khi lưu');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrentForm = async () => {
    if (!formCode.trim()) {
      alert('Vui lòng nhập Mã Ref Code');
      return;
    }

    const newItem: RefcodeItem = {
      id: selectedId || `ref-${Date.now()}`,
      code: formCode.trim(),
      slug: formSlug.trim() || slugifyRefcode(formCode),
      title: formTitle.trim() || 'REFCODE',
      owner: formOwner.trim() || 'Horizon RP',
      reward: formReward.trim() || 'Quà tặng tân thủ 50.000$',
      targetUrl: formTargetUrl.trim() || 'https://discord.gg/horizonrp',
      boxColor: formBoxColor || '#00DCFF',
      textColor: formTextColor || '#000000',
      titleColor: formTitleColor || '#FFFFFF',
      codeFont: formCodeFont || '1FTV VIP Sakana',
      titleFont: formTitleFont || '1FTV VIP Sakana',
      createdAt: new Date().toISOString(),
    };

    const existsIndex = refcodes.findIndex((i) => i.id === newItem.id);
    let updated: RefcodeItem[] = [];

    if (existsIndex >= 0) {
      updated = [...refcodes];
      updated[existsIndex] = newItem;
    } else {
      updated = [newItem, ...refcodes];
    }

    setSelectedId(newItem.id);
    await handleSaveAll(updated);
  };

  const handleDeleteItem = (idToDelete: string) => {
    if (refcodes.length <= 1) {
      alert('Cần giữ lại ít nhất 1 Ref Code trong hệ thống!');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa Ref Code này?')) {
      const updated = refcodes.filter((i) => i.id !== idToDelete);
      setRefcodes(updated);
      if (selectedId === idToDelete) {
        selectItem(updated[0]);
      }
      handleSaveAll(updated);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBulkIds.length === 0) return;
    if (refcodes.length - selectedBulkIds.length < 1) {
      alert('Cần giữ lại ít nhất 1 Ref Code trong hệ thống!');
      return;
    }
    if (confirm(`Xác nhận xóa ${selectedBulkIds.length} Ref Code đã chọn?`)) {
      const updated = refcodes.filter((i) => !selectedBulkIds.includes(i.id));
      setRefcodes(updated);
      setSelectedBulkIds([]);
      selectItem(updated[0]);
      handleSaveAll(updated);
    }
  };

  const copyRefcodeLink = (slugOrCode: string, id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/refcode/${slugOrCode}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setToastMessage(`Đã sao chép link OBS: ${url}`);
      setTimeout(() => {
        setCopiedId(null);
        setToastMessage(null), 3000;
      });
    }
  };

  // Filtered & Paginated List
  const filteredRefcodes = useMemo(() => {
    if (!searchQuery.trim()) return refcodes;
    const q = searchQuery.toLowerCase().trim();
    return refcodes.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        (item.owner && item.owner.toLowerCase().includes(q)) ||
        (item.slug && item.slug.toLowerCase().includes(q))
    );
  }, [refcodes, searchQuery]);

  const totalPages = Math.ceil(filteredRefcodes.length / pageSize) || 1;
  const paginatedRefcodes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRefcodes.slice(start, start + pageSize);
  }, [filteredRefcodes, currentPage, pageSize]);

  const toggleSelectAll = () => {
    const pageIds = paginatedRefcodes.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedBulkIds.includes(id));
    if (allSelected) {
      setSelectedBulkIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedBulkIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedBulkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white/70 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#00DCFF]" />
        Đang nạp hệ thống Quản lý Ref Code CMS...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00DCFF]/15 border border-[#00DCFF]/40 text-[#00DCFF] text-xs font-mono font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#00DCFF]" />
              OBS Streamer Refcode Engine (Custom Fonts & Colors)
            </span>

            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                dataSource === 'supabase'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {dataSource === 'supabase'
                ? '⚡ Supabase Cloud Sync'
                : '📁 Local Storage Fallback'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Quản Lý Ref Code Lottie ({refcodes.length} Mã)
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Tùy biến toàn bộ Font chữ (1FTV VIP Sakana, Chakra Petch,...) và màu sắc chữ/hộp, tự động dãn box và xuất link OBS trong suốt 100%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startCreateNew}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00DCFF] to-[#0096C7] text-black font-heading font-extrabold text-xs uppercase tracking-wide hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,220,255,0.3)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Ref Code Mới</span>
          </button>

          <button
            onClick={fetchData}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-[#00DCFF]/15 border border-[#00DCFF]/40 text-[#00DCFF] text-xs font-mono font-bold flex items-center gap-3 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-0 flex-wrap">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-6 py-3 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'list'
              ? 'border-[#00DCFF] text-[#00DCFF] bg-white/5 rounded-t-xl'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5 rounded-t-xl'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>📋 Danh Sách Ref Code ({refcodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-6 py-3 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'editor'
              ? 'border-[#00DCFF] text-[#00DCFF] bg-white/5 rounded-t-xl'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5 rounded-t-xl'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>✏️ Trình Tạo, Font & Màu Sắc & Live Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('obs-guide')}
          className={`flex items-center gap-2 px-6 py-3 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'obs-guide'
              ? 'border-[#00DCFF] text-[#00DCFF] bg-white/5 rounded-t-xl'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5 rounded-t-xl'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>📺 Hướng Dẫn Thêm Vào OBS Studio</span>
        </button>
      </div>

      {/* TAB 1: LIST DIRECTORY */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm theo Mã, Người sở hữu hoặc Slug..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1217] border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#00DCFF] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedBulkIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa {selectedBulkIds.length} mục</span>
                </button>
              )}

              <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
                <span>Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-white focus:outline-none focus:border-[#00DCFF]"
                >
                  <option value={10}>10 dòng / trang</option>
                  <option value={20}>20 dòng / trang</option>
                  <option value={50}>50 dòng / trang</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-[#161B24] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F1217]/80 border-b border-white/10 text-[11px] font-heading font-bold uppercase tracking-wider text-white/60">
                    <th className="p-4 w-12 text-center">
                      <button onClick={toggleSelectAll} className="text-white/60 hover:text-white">
                        {paginatedRefcodes.length > 0 &&
                        paginatedRefcodes.every((i) => selectedBulkIds.includes(i.id)) ? (
                          <CheckSquare className="w-4 h-4 text-[#00DCFF]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Mã Ref Code & Font</th>
                    <th className="p-4">Người Sở Hữu</th>
                    <th className="p-4">Link OBS (Tách Nền 100%)</th>
                    <th className="p-4">Màu Chữ / Hộp</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {paginatedRefcodes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-white/40 font-mono">
                        {searchQuery
                          ? 'Không tìm thấy Ref Code phù hợp.'
                          : 'Chưa có Ref Code nào.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedRefcodes.map((item) => {
                      const isChecked = selectedBulkIds.includes(item.id);
                      const isSelectedCurrent = selectedId === item.id;
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-white/5 transition-colors ${
                            isSelectedCurrent ? 'bg-[#00DCFF]/5' : ''
                          }`}
                        >
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleSelectRow(item.id)}
                              className="text-white/60 hover:text-white"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#00DCFF]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className="px-3 py-1.5 rounded-lg border font-mono font-black text-sm tracking-wide"
                                  style={{
                                    backgroundColor: item.boxColor || '#00DCFF',
                                    color: item.textColor || '#000000',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                  }}
                                >
                                  {item.code}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">
                                  ({item.code.length} ký tự)
                                </span>
                              </div>
                              <div className="text-[10px] text-white/50 font-mono">
                                Font: {item.codeFont || '1FTV VIP Sakana'}
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-white/90 font-medium">
                              {item.owner || 'Chưa đặt tên'}
                            </div>
                            <div className="text-[11px] text-white/40 font-mono truncate max-w-xs">
                              {item.reward || 'Không có ghi chú'}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <code className="text-[11px] text-[#00DCFF] bg-[#00DCFF]/10 px-2 py-1 rounded font-mono">
                                /refcode/{item.slug || item.code}
                              </code>
                              <button
                                onClick={() => copyRefcodeLink(item.slug || item.code, item.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-[#00DCFF]/20 hover:bg-[#00DCFF]/30 text-[#00DCFF] text-[10px] font-bold font-mono transition-colors"
                                title="Sao chép link cho OBS Browser Source"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Đã Copy</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Link OBS</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <div className="flex items-center gap-1" title="Màu Box">
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-white/30"
                                  style={{ backgroundColor: item.boxColor || '#00DCFF' }}
                                />
                                <span className="text-white/60">{item.boxColor || '#00DCFF'}</span>
                              </div>
                              <span className="text-white/30">/</span>
                              <div className="flex items-center gap-1" title="Màu Chữ">
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-white/30"
                                  style={{ backgroundColor: item.textColor || '#000000' }}
                                />
                                <span className="text-white/60">{item.textColor || '#000000'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => selectItem(item, true)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                                title="Chỉnh sửa & Xem Live Preview"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <a
                                href={`/refcode/${item.slug || item.code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#00DCFF] transition-colors"
                                title="Mở trực tiếp link OBS"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Xóa Ref Code"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDITOR & LIVE PREVIEW */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl bg-[#161B24] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-white font-heading font-black text-base uppercase">
                  <Sliders className="w-4 h-4 text-[#00DCFF]" />
                  <span>Tùy Chỉnh Toàn Bộ Text, Font & Màu Sắc</span>
                </div>
                <span className="text-[11px] font-mono text-white/40">
                  ID: {selectedId || 'Mới'}
                </span>
              </div>

              {/* SECTION A: TEXT & REF CODE */}
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-heading font-black uppercase text-[#00DCFF] flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>1. Cấu Hình Mã Ref Code (box-code-text)</span>
                </div>

                {/* Input: Ref Code */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-white/80 flex items-center justify-between">
                    <span>Nội dung Mã:</span>
                    <span className="text-[#00DCFF] font-mono">{formCode.length} ký tự</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="Ví dụ: Ibunny, TUWCOR, VIP..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F1217] border border-white/20 text-white font-mono font-bold text-base focus:outline-none focus:border-[#00DCFF]"
                  />
                </div>

                {/* Font Selector for Code */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-white/80">
                    Font chữ của Mã Ref:
                  </label>
                  <select
                    value={formCodeFont}
                    onChange={(e) => setFormCodeFont(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color for Code Text */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-white/80">
                    Màu chữ của Mã Ref:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formTextColor}
                        onChange={(e) => setFormTextColor(e.target.value)}
                        className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formTextColor}
                        onChange={(e) => setFormTextColor(e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setFormTextColor(p.value)}
                          className="w-6 h-6 rounded-lg border border-white/20 transition-transform hover:scale-110"
                          style={{ backgroundColor: p.value }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: BOX COLOR & SHAPE */}
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-heading font-black uppercase text-[#00DCFF] flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>2. Cấu Hình Màu Hộp (box-text)</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formBoxColor}
                        onChange={(e) => setFormBoxColor(e.target.value)}
                        className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formBoxColor}
                        onChange={(e) => setFormBoxColor(e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {BOX_COLOR_PRESETS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormBoxColor(c.value)}
                          className="w-6 h-6 rounded-lg border border-white/20 transition-transform hover:scale-110"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/50">
                    ⚡ Khối `box-text` sẽ tự động dãn ra hoặc thu lại hoàn hảo theo độ dài của chữ.
                  </p>
                </div>
              </div>

              {/* SECTION C: TITLE CONFIGURATION */}
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-heading font-black uppercase text-amber-400 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>3. Cấu Hình Tiêu Đề Trên (REFCODE- title)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">Nội dung Tiêu đề:</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="REFCODE"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">Font chữ Tiêu đề:</label>
                    <select
                      value={formTitleFont}
                      onChange={(e) => setFormTitleFont(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                    >
                      {AVAILABLE_FONTS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-white/80">Màu chữ Tiêu đề:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formTitleColor}
                      onChange={(e) => setFormTitleColor(e.target.value)}
                      className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTitleColor}
                      onChange={(e) => setFormTitleColor(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0F1217] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: SLUG & METADATA */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">Đường dẫn Slug URL:</label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(slugifyRefcode(e.target.value))}
                      placeholder="ibunny"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-[#00DCFF] font-mono text-xs focus:outline-none focus:border-[#00DCFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">Người Sở Hữu / Streamer:</label>
                    <input
                      type="text"
                      value={formOwner}
                      onChange={(e) => setFormOwner(e.target.value)}
                      placeholder="Ibunny"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1217] border border-white/15 text-white text-xs focus:outline-none focus:border-[#00DCFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleSaveCurrentForm}
                  disabled={saving}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00DCFF] hover:bg-[#00c5e6] text-black font-heading font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,220,255,0.3)] transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang Lưu...' : 'Lưu Cấu Hình Ref Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyRefcodeLink(formSlug || formCode, 'current')}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-heading font-bold uppercase transition-all"
                  title="Sao chép link cho OBS"
                >
                  {copiedId === 'current' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedId === 'current' ? 'Đã Copy' : 'Copy Link OBS'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Lottie Interactive Preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl bg-[#161B24] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm uppercase">
                  <Eye className="w-4 h-4 text-[#00DCFF]" />
                  <span>Live Preview (Thời Gian Thực)</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewTransparent(!previewTransparent)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
                  >
                    {previewTransparent ? '⬜ Xem nền tối' : '🏁 Xem nền trong suốt (OBS)'}
                  </button>

                  <a
                    href={`/refcode/${formSlug || formCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-[#00DCFF] hover:underline"
                  >
                    <span>Mở Link OBS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Live Preview Container (Pure Animation, Auto Looping with Custom Fonts & Colors) */}
              <div
                className={`flex items-center justify-center p-4 rounded-2xl transition-colors ${
                  previewTransparent
                    ? 'bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] bg-[#07090D]'
                    : 'bg-[#0F1217]'
                }`}
              >
                <div className="w-full max-w-[380px] aspect-square flex items-center justify-center">
                  <LottieRefcodePlayer
                    code={formCode}
                    title={formTitle}
                    boxColor={formBoxColor}
                    textColor={formTextColor}
                    titleColor={formTitleColor}
                    codeFont={formCodeFont}
                    titleFont={formTitleFont}
                    loop={true}
                    autoplay={true}
                    renderer="svg"
                    pauseDelaySec={0}
                    transparentBg={true}
                    showControls={true}
                    aspectRatio="aspect-square"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Geometry Diagnostic Metrics */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="text-white/60 font-bold uppercase text-[10px] tracking-wider text-[#00DCFF]">
                  📐 Thông Số Toán Học & Font Đang Áp Dụng:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-white/80">
                  <div>
                    Font Mã Ref: <span className="text-[#00DCFF]">{formCodeFont}</span>
                  </div>
                  <div>
                    Màu Chữ Mã: <span className="text-[#00DCFF]">{formTextColor}</span>
                  </div>
                  <div>
                    Màu Hộp Box: <span className="text-[#00DCFF]">{formBoxColor}</span>
                  </div>
                  <div>
                    Độ dài text: <span className="text-[#00DCFF]">{formCode.length} ký tự</span>
                  </div>
                  <div>
                    Font size: <span className="text-[#00DCFF]">{liveGeometry.fontSize}px</span>
                  </div>
                  <div>
                    Visual width: <span className="text-[#00DCFF]">{liveGeometry.visualWidth}px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OBS STUDIO GUIDE */}
      {activeTab === 'obs-guide' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-[#161B24] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-3 rounded-2xl bg-[#00DCFF]/15 text-[#00DCFF]">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-heading font-black text-white uppercase">
                  Cách Thêm Link Ref Code Vào OBS Studio
                </h2>
                <p className="text-xs text-white/60">
                  Hoạt ảnh trong suốt 100%, loop liên tục mượt mà, áp dụng chính xác Font và Màu sắc tùy chỉnh.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-white/80 font-sans">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-heading font-bold text-white uppercase flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00DCFF] text-black font-mono font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Tạo Nguồn Trình Duyệt (Browser Source) trong OBS</span>
                </div>
                <p className="text-white/70 pl-8">
                  Mở OBS Studio &rarr; Tại bảng <strong>Sources (Nguồn)</strong> &rarr; Bấm dấu <strong>+</strong> &rarr; Chọn <strong>Browser (Trình duyệt)</strong> &rarr; Đặt tên (ví dụ: <code className="text-[#00DCFF] font-mono">RefCode Horizon</code>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-heading font-bold text-white uppercase flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00DCFF] text-black font-mono font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Điền Cấu Hình URL & Kích Thước</span>
                </div>
                <div className="pl-8 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-white/40">URL Chuẩn (Tên/Mã):</div>
                      <div className="text-[#00DCFF] font-bold truncate">
                        http://localhost:4028/refcode/Ibunny
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-white/40">URL Số Nhanh (id#xxxxxxxx):</div>
                      <div className="text-[#00DCFF] font-bold truncate">
                        http://localhost:4028/refcode/id#12345678
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-white/40">Kích thước (Khuyên dùng):</div>
                      <div className="text-white/80 font-bold">600 x 600 px</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#00DCFF]/10 border border-[#00DCFF]/20 text-[11px] text-[#00DCFF]">
                    💡 <strong>Tính năng URL Số Tự Động (id#xxxxxxxx):</strong> Bạn có thể dùng trực tiếp đường dẫn dạng <code className="font-bold bg-black/40 px-1.5 py-0.5 rounded text-[#00DCFF]">/refcode/id#12345678</code> (hoặc <code className="font-bold bg-black/40 px-1.5 py-0.5 rounded text-[#00DCFF]">/refcode/#12345678</code>) với tối đa 8 chữ số. Hệ thống sẽ tự động tạo ngay mã ref tương ứng với tiêu đề mặc định là <strong>&quot;REFCODE&quot;</strong> mà không cần tạo trước trong CMS!
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-heading font-bold text-white uppercase flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00DCFF] text-black font-mono font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Tùy Chọn Khuyên Dùng Trong OBS</span>
                </div>
                <ul className="pl-8 space-y-1.5 list-disc list-inside text-white/70">
                  <li>Tích chọn <strong>&quot;Shutdown source when not visible&quot;</strong> (Tắt khi ẩn cảnh để tiết kiệm GPU/CPU).</li>
                  <li>Tích chọn <strong>&quot;Refresh browser when scene becomes active&quot;</strong> (Làm mới khi chuyển cảnh).</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={() => setActiveTab('editor')}
                className="px-6 py-3 rounded-xl bg-[#00DCFF] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#00c5e6] transition-all"
              >
                Trở lại Trình Tạo Ref Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
