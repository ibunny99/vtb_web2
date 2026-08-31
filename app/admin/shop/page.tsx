'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Flame,
  ShoppingBag,
  Check,
  X,
  ExternalLink,
  Package,
  Layers,
  DollarSign,
  Tag,
  Eye,
  Loader2,
} from 'lucide-react';
import { DEFAULT_PRODUCTS, ProductItem, SIZE_CHART_TEE } from '@/lib/shop-data';

export default function AdminShopCMSPage() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    name: '',
    khmerName: '',
    slug: '',
    category: 'merch',
    categoryLabel: 'Official Merchandise',
    price: 30,
    originalPrice: 40,
    khmerPrice: '120,000 ៛',
    isPreOrder: true,
    preOrderEstimatedDate: 'Estimated dispatch: 2-3 weeks / ដឹកជញ្ជូនក្នុងរយៈពេល ២-៣ សប្តាហ៍',
    isPhysical: true,
    badge: 'NEW DROP',
    thumbnail: '',
    images: [],
    shortDescription: '',
    description: '',
    khmerDescription: '',
    features: [],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [{ name: 'Stealth Black', hex: '#0F1217' }],
  });

  const [imagesInput, setImagesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL, 2XL, 3XL');

  const fetchProducts = () => {
    fetch('/api/shop/products')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products)) {
          setProducts(d.products);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      name: '',
      khmerName: '',
      slug: '',
      category: 'merch',
      categoryLabel: 'Official Merchandise',
      price: 32,
      originalPrice: 42,
      khmerPrice: '130,000 ៛',
      isPreOrder: true,
      preOrderEstimatedDate: 'Estimated dispatch: 2-3 weeks / ដឹកជញ្ជូនក្នុងរយៈពេល ២-៣ សប្តាហ៍',
      isPhysical: true,
      inStock: true,
      badge: 'PRE-ORDER',
      thumbnail: 'https://i.ibb.co/3ykbN57w/vtb-tee-front.jpg',
      images: ['https://i.ibb.co/3ykbN57w/vtb-tee-front.jpg'],
      shortDescription: '',
      description: '',
      khmerDescription: '',
      features: ['100% Heavy Combed Cotton 280GSM', 'Reflective Neon UV Ink'],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      colors: [{ name: 'Stealth Black', hex: '#0F1217' }],
    });
    setImagesInput('https://i.ibb.co/3ykbN57w/vtb-tee-front.jpg');
    setFeaturesInput('100% Heavy Combed Cotton 280GSM\nReflective Neon UV Ink');
    setSizesInput('S, M, L, XL, 2XL, 3XL');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setImagesInput((prod.images || []).join('\n'));
    setFeaturesInput((prod.features || []).join('\n'));
    setSizesInput((prod.sizes || []).join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/shop/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const parsedImages = imagesInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedFeatures = featuresInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedSizes = sizesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const generatedSlug =
        formData.slug?.trim() ||
        formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
        `prod-${Date.now()}`;

      const finalProduct: ProductItem = {
        id: formData.id || `prod-${Date.now()}`,
        slug: generatedSlug,
        name: formData.name || 'New Product',
        khmerName: formData.khmerName || '',
        category: (formData.category as any) || 'merch',
        categoryLabel:
          formData.category === 'merch'
            ? 'Official Merchandise'
            : formData.category === 'membership'
            ? 'Queue Priority & VIP'
            : formData.category === 'bundle'
            ? 'Starter Packs & Bundles'
            : 'Custom In-Game Services',
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        khmerPrice: formData.khmerPrice || `${(Number(formData.price || 0) * 4100).toLocaleString()} ៛`,
        isPreOrder: Boolean(formData.isPreOrder),
        preOrderEstimatedDate: formData.preOrderEstimatedDate || '',
        isPhysical: Boolean(formData.isPhysical),
        badge: formData.badge || '',
        thumbnail: parsedImages[0] || formData.thumbnail || '/v1b-logo.png',
        images: parsedImages.length > 0 ? parsedImages : [formData.thumbnail || '/v1b-logo.png'],
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        khmerDescription: formData.khmerDescription || '',
        features: parsedFeatures,
        sizes: parsedSizes,
        colors: formData.colors || [],
        inStock: true,
      };

      const res = await fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: finalProduct }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✓ Product saved successfully!');
        setIsModalOpen(false);
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.message || 'Error saving product');
      }
    } catch (e) {
      alert('Network error while saving product');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase text-white tracking-tight">
            Quản Lý Cửa Hàng & Sản Phẩm (Shop CMS)
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Quản lý chiến dịch Pre-Order Áo VTB, sản phẩm Merch và gói vật phẩm game.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-xl bg-[#00DCFF] hover:bg-[#52F0FF] text-black font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,220,255,0.35)] active:scale-95 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div className="p-4 rounded-xl font-heading text-xs font-bold bg-[rgba(0,220,255,0.15)] border border-[#00DCFF]/40 text-[#00DCFF]">
          {message}
        </div>
      )}

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Tổng Sản Phẩm
          </span>
          <span className="font-heading font-black text-2xl text-white">{products.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Pre-Order Merch
          </span>
          <span className="font-heading font-black text-2xl text-[#00DCFF]">
            {products.filter((p) => p.isPreOrder).length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Vật Phẩm Vật Lý (Áo/Quần)
          </span>
          <span className="font-heading font-black text-2xl text-emerald-400">
            {products.filter((p) => p.isPhysical).length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Gói In-Game / VIP
          </span>
          <span className="font-heading font-black text-2xl text-amber-400">
            {products.filter((p) => !p.isPhysical).length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161B24] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00DCFF]/60"
          />
        </div>

        <div className="text-xs text-white/40 font-mono">
          Hiển thị {filtered.length} / {products.length}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#161B24] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#11151b] text-white/50 uppercase font-heading tracking-wider border-b border-white/10">
                <th className="p-4">Ảnh</th>
                <th className="p-4">Tên Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Giá ($ USD)</th>
                <th className="p-4">Pre-Order</th>
                <th className="p-4">Loại Hàng</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80 font-sans">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.thumbnail || prod.images[0] || '/v1b-logo.png'}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-heading font-bold text-sm text-white block">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-white/40 font-mono">
                        Slug: /shop/{prod.slug}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono uppercase text-[#00DCFF]">
                      {prod.category}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-sm text-white">
                    ${prod.price}
                  </td>

                  <td className="p-4">
                    {prod.isPreOrder ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#00DCFF]/15 border border-[#00DCFF]/40 text-[#00DCFF] text-[10px] font-mono font-bold">
                        <Flame className="w-3 h-3" /> Pre-Order
                      </span>
                    ) : (
                      <span className="text-white/40 font-mono text-[11px]">Sẵn có</span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    {prod.isPhysical ? (
                      <span className="text-emerald-400">Vật lý (Giao hàng)</span>
                    ) : (
                      <span className="text-amber-400">Kỹ thuật số (In-Game)</span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <a
                      href={`/shop/${prod.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white inline-block transition-colors"
                      title="Xem trang sản phẩm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-[#121620] border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00DCFF] to-[#0088FF]" />

            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-black uppercase text-white tracking-wide">
                  {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Điền thông tin chi tiết sản phẩm, ảnh preview và kích cỡ
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Tên Sản Phẩm (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. VTB Official Cyber Tee 2026"
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Tên Tiếng Campuchia / Khmer
                  </label>
                  <input
                    type="text"
                    value={formData.khmerName}
                    onChange={(e) => setFormData({ ...formData, khmerName: e.target.value })}
                    placeholder="e.g. អាវយឺតផ្លូវការ VTB 2026"
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vtb-official-tee"
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Danh Mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                  >
                    <option value="merch">Official Merch (Áo/Hoodie)</option>
                    <option value="membership">Queue Priority & VIP</option>
                    <option value="bundle">Starter Packs & Bundles</option>
                    <option value="service">Custom Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Huy Hiệu (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. PRE-ORDER SPECIAL"
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Giá Bán ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Giá Gốc ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Giá Tiền Riels (៛ KHR)
                  </label>
                  <input
                    type="text"
                    value={formData.khmerPrice}
                    onChange={(e) => setFormData({ ...formData, khmerPrice: e.target.value })}
                    placeholder="130,000 ៛"
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPreOrder}
                    onChange={(e) => setFormData({ ...formData, isPreOrder: e.target.checked })}
                    className="w-4 h-4 accent-[#00DCFF]"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs uppercase text-white block">
                      Chiến Dịch Pre-Order
                    </span>
                    <span className="text-[11px] text-white/50">
                      Gắn mác mở bán đặt trước với thời gian sản xuất
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPhysical}
                    onChange={(e) => setFormData({ ...formData, isPhysical: e.target.checked })}
                    className="w-4 h-4 accent-[#00DCFF]"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs uppercase text-white block">
                      Hàng Vật Lý (Cần Giao Hàng)
                    </span>
                    <span className="text-[11px] text-white/50">
                      Yêu cầu khách điền địa chỉ giao hàng và SĐT khi thanh toán
                    </span>
                  </div>
                </label>
              </div>

              {formData.isPreOrder && (
                <div>
                  <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                    Thông Báo Thời Gian Giao Dự Kiến (Pre-Order Schedule)
                  </label>
                  <input
                    type="text"
                    value={formData.preOrderEstimatedDate}
                    onChange={(e) => setFormData({ ...formData, preOrderEstimatedDate: e.target.value })}
                    className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                  />
                </div>
              )}

              {/* Images Preview URLs */}
              <div>
                <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                  Danh Sách URL Hình Ảnh Preview (Mỗi dòng 1 URL) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="https://i.ibb.co/vtb-front.jpg&#10;https://i.ibb.co/vtb-back.jpg&#10;https://i.ibb.co/vtb-tag.jpg"
                  className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                  Danh Sách Kích Cỡ (Sizes) (Ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="S, M, L, XL, 2XL, 3XL"
                  className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                />
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                  Mô Tả Ngắn
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Streetwear tee with reflective print..."
                  className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                  Mô Tả Chi Tiết & Thông Số Vải
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed material information, fit style, graphic explanation..."
                  className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00DCFF]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-white uppercase mb-1">
                  Đặc Điểm Nổi Bật (Features / Highlights) (Mỗi dòng 1 gạch đầu dòng)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="100% Combed Cotton 280GSM&#10;Reflective Silkscreen Back Graphic"
                  className="w-full bg-[#161B24] border border-white/15 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00DCFF]/60"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-heading font-bold text-xs uppercase"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#00DCFF] text-black font-heading font-black text-xs uppercase tracking-wider hover:bg-[#52F0FF] transition-all flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
