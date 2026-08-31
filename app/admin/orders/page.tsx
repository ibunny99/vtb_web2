'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  DollarSign,
  User,
  Phone,
  MapPin,
  Calendar,
  Gamepad2,
  Trash2,
  Eye,
  RefreshCw,
  X,
  CreditCard,
  QrCode,
  Coins,
} from 'lucide-react';
import { OrderItem } from '@/lib/shop-data';

export default function AdminOrdersCMSPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/shop/orders')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.orders)) {
          setOrders(d.orders);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/shop/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus as any } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus as any } : null));
        }
      }
    } catch (e) {
      alert('Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/shop/orders?id=${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setIsDetailModalOpen(false);
      }
    } catch (e) {
      alert('Error deleting order');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const processingCount = orders.filter((o) => o.orderStatus === 'processing' || o.orderStatus === 'pending').length;
  const completedCount = orders.filter((o) => o.orderStatus === 'completed' || o.orderStatus === 'shipped').length;

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      q === '' ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      (o.customer.phoneNumber && o.customer.phoneNumber.includes(q)) ||
      (o.customer.discordTag && o.customer.discordTag.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase text-white tracking-tight">
            Quản Lý Đơn Hàng Đã Đặt (Orders List)
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Theo dõi danh sách khách hàng đặt áo Pre-Order, số lượng, size và địa chỉ giao hàng.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Tổng Đơn Hàng
          </span>
          <span className="font-heading font-black text-2xl text-white">{orders.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Tổng Doanh Thu ($)
          </span>
          <span className="font-heading font-black text-2xl text-[#00DCFF]">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Đang Xử Lý / Sản Xuất
          </span>
          <span className="font-heading font-black text-2xl text-amber-400">
            {processingCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-white/50 uppercase block">
            Đã Giao / Hoàn Tất
          </span>
          <span className="font-heading font-black text-2xl text-emerald-400">
            {completedCount}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'processing', 'shipped', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#00DCFF] text-black shadow-lg'
                  : 'bg-[#161B24] text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {st === 'all' && 'Tất cả đơn'}
              {st === 'processing' && 'Đang xử lý'}
              {st === 'shipped' && 'Đang giao hàng'}
              {st === 'completed' && 'Hoàn thành'}
              {st === 'cancelled' && 'Đã hủy'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, SĐT, tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161B24] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00DCFF]/60"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#161B24] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-[#11151b] text-white/50 uppercase font-heading tracking-wider border-b border-white/10">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Sản Phẩm Đặt</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-white/40 font-mono">
                    Chưa có đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#00DCFF]">
                      {ord.orderNumber}
                    </td>

                    <td className="p-4 text-white/50 font-mono">
                      {new Date(ord.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-heading font-bold text-white block">
                          {ord.customer.fullName}
                        </span>
                        <span className="text-[11px] text-white/50 font-mono block">
                          {ord.customer.email}
                        </span>
                        {ord.customer.phoneNumber && (
                          <span className="text-[11px] text-emerald-400 font-mono block">
                            📞 {ord.customer.phoneNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1 max-w-xs">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-white font-bold">x{it.quantity}</span>
                            <span className="text-white/80 truncate">{it.productName}</span>
                            {it.size && (
                              <span className="px-1 py-0.2 rounded bg-white/10 text-[9px] font-mono text-[#00DCFF]">
                                {it.size}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-black text-sm text-white">
                      ${ord.total.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-white/70">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        disabled={updatingId === ord.id}
                        className={`text-[11px] font-heading font-bold uppercase rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          ord.orderStatus === 'completed'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : ord.orderStatus === 'shipped'
                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                            : ord.orderStatus === 'processing'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                            : 'bg-red-500/15 border-red-500/40 text-red-400'
                        }`}
                      >
                        <option value="processing" className="bg-[#121620] text-white">
                          Đang Xử Lý
                        </option>
                        <option value="shipped" className="bg-[#121620] text-white">
                          Đang Giao Hàng
                        </option>
                        <option value="completed" className="bg-[#121620] text-white">
                          Hoàn Tất
                        </option>
                        <option value="cancelled" className="bg-[#121620] text-white">
                          Đã Hủy
                        </option>
                      </select>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                        title="Xem hóa đơn chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Xóa đơn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="absolute inset-0" onClick={() => setIsDetailModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-[#121620] border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00DCFF] to-[#0088FF]" />

            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-heading font-black uppercase text-white tracking-wide">
                  Chi Tiết Đơn Hàng {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer Box */}
              <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-3 font-mono">
                <div className="text-[#00DCFF] font-bold font-heading uppercase text-xs">
                  1. Thông Tin Người Nhận
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                  <div>
                    <span className="text-white/40 block">Họ Tên:</span>
                    <strong className="text-white text-sm">{selectedOrder.customer.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Email:</span>
                    <strong>{selectedOrder.customer.email}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Số Điện Thoại:</span>
                    <strong className="text-emerald-400">{selectedOrder.customer.phoneNumber || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Discord / Citizen ID:</span>
                    <strong>{selectedOrder.customer.discordTag || selectedOrder.customer.citizenId || 'N/A'}</strong>
                  </div>
                </div>

                {selectedOrder.customer.shippingAddress && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/40 block">Địa Chỉ Giao Hàng (Áo Merch):</span>
                    <strong className="text-white text-sm block mt-0.5">
                      {selectedOrder.customer.shippingAddress}, {selectedOrder.customer.city}
                    </strong>
                  </div>
                )}

                {selectedOrder.customer.orderNotes && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/40 block">Ghi Chú Đơn Hàng:</span>
                    <p className="text-white/80">{selectedOrder.customer.orderNotes}</p>
                  </div>
                )}
              </div>

              {/* Items Box */}
              <div className="p-4 rounded-2xl bg-[#161B24] border border-white/10 space-y-3 font-mono">
                <div className="text-[#00DCFF] font-bold font-heading uppercase text-xs">
                  2. Danh Sách Sản Phẩm Đặt Mua
                </div>

                <div className="divide-y divide-white/5 space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={it.thumbnail || '/v1b-logo.png'}
                            alt={it.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-heading font-bold text-white block">
                            {it.productName}
                          </span>
                          <div className="flex gap-2 text-[10px] text-white/50">
                            {it.size && <span>Size: <strong className="text-[#00DCFF]">{it.size}</strong></span>}
                            {it.color && <span>Màu: {it.color}</span>}
                            <span>SL: {it.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <span className="font-bold text-sm text-white">
                        ${it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1 text-right">
                  <div className="text-white/60">Tạm tính: ${selectedOrder.subtotal.toFixed(2)}</div>
                  {selectedOrder.discount > 0 && (
                    <div className="text-emerald-400">Giảm giá: -${selectedOrder.discount.toFixed(2)}</div>
                  )}
                  <div className="text-base font-heading font-black text-[#00DCFF]">
                    Tổng cộng: ${selectedOrder.total.toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B0E14] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#00DCFF] text-black font-heading font-bold text-xs uppercase"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
