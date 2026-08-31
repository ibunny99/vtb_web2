'use client';

import React, { useState, useEffect } from 'react';

interface RuleItem {
  id: number;
  category: string;
  title: string;
  shortCode?: string;
  summary: string;
  details?: string;
}

export default function AdminRulesManagerPage() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Modal / Editing State
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setRules(d.data.rules || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenAdd = () => {
    const nextId = rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
    setEditingRule({
      id: nextId,
      category: 'General',
      title: '',
      shortCode: '',
      summary: '',
      details: '',
    });
    setIsNew(true);
  };

  const handleOpenEdit = (rule: RuleItem) => {
    setEditingRule({ ...rule });
    setIsNew(false);
  };

  const handleDelete = (id: number) => {
    if (confirm(`Bạn có chắc chắn muốn xóa Điều Luật #${id}?`)) {
      const updated = rules.filter((r) => r.id !== id);
      setRules(updated);
      saveRules(updated);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    let updatedRules: RuleItem[];
    if (isNew) {
      updatedRules = [...rules, editingRule];
    } else {
      updatedRules = rules.map((r) => (r.id === editingRule.id ? editingRule : r));
    }

    setRules(updatedRules);
    setEditingRule(null);
    saveRules(updatedRules);
  };

  const saveRules = async (rulesToSave: RuleItem[]) => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules: rulesToSave }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Cập nhật danh sách điều luật thành công!');
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
    return <div className="text-white font-heading">Đang tải danh sách điều luật...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold uppercase text-white tracking-tight">
            Quản Lý Điều Luật ({rules.length})
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Thêm mới, chỉnh sửa nội dung hoặc xóa các quy định trên máy chủ.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 bg-[#00DCFF] hover:bg-[#b5ee70] text-black font-heading font-bold text-xs uppercase rounded-xl transition-all shadow-lg active:scale-95 self-start sm:self-auto"
        >
          + Thêm Điều Luật Mới
        </button>
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

      {/* Rules List Table */}
      <div className="bg-[#161B24] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#11151b] font-heading text-white/50 uppercase border-b border-white/10">
              <tr>
                <th className="p-4 w-16">ID</th>
                <th className="p-4 w-32">Danh Mục</th>
                <th className="p-4">Tên Điều Luật</th>
                <th className="p-4">Tóm Tắt</th>
                <th className="p-4 w-28 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-heading font-bold text-[#00DCFF]">#{rule.id}</td>
                  <td className="p-4 font-mono text-white/50">{rule.category}</td>
                  <td className="p-4 font-heading font-bold text-white">
                    {rule.title}
                    {rule.shortCode && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono text-white/70">
                        {rule.shortCode}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-white/70 max-w-xs truncate">{rule.summary}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-bold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B24] border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {isNew ? 'Thêm Điều Luật Mới' : `Chỉnh Sửa Điều Luật #${editingRule.id}`}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                    Số Luật (ID)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRule.id}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, id: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                    Phân Loại Category
                  </label>
                  <select
                    value={editingRule.category}
                    onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value })}
                    className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Community">Community (Cộng đồng)</option>
                    <option value="General">General (Chung)</option>
                    <option value="Conflict">Conflict (Tranh chấp)</option>
                    <option value="Government">Government (Chính phủ)</option>
                    <option value="Conduct">Conduct (Hành vi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                  Tên Điều Luật (Title)
                </label>
                <input
                  type="text"
                  required
                  value={editingRule.title}
                  onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                  placeholder="VD: Value Your Life..."
                  className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                  Ký hiệu viết tắt (ShortCode - Nếu có)
                </label>
                <input
                  type="text"
                  value={editingRule.shortCode || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, shortCode: e.target.value })}
                  placeholder="VD: NVL, RDM, MG..."
                  className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                  Tóm Tắt Ngắn (Summary)
                </label>
                <input
                  type="text"
                  required
                  value={editingRule.summary}
                  onChange={(e) => setEditingRule({ ...editingRule, summary: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn..."
                  className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase text-white/60 mb-1">
                  Chi Tiết Điều Luật (Details)
                </label>
                <textarea
                  rows={4}
                  value={editingRule.details || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, details: e.target.value })}
                  placeholder="Nội dung giải thích chi tiết..."
                  className="w-full bg-[#11151b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#00DCFF] hover:bg-[#b5ee70] text-black font-heading text-xs font-bold rounded-xl transition-colors"
                >
                  {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
