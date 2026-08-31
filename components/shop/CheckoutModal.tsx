'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { OrderCustomerInfo } from '@/lib/shop-data';

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    total,
    subtotal,
    discountAmount,
    discountCode,
    shippingFee,
    clearCart,
    hasPhysicalItems,
  } = useCart();

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);

  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
    shippingAddress: '',
    city: 'Phnom Penh',
    country: 'Cambodia',
    discordTag: '',
    citizenId: '',
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'card' | 'crypto' | 'paypal'>('khqr');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof OrderCustomerInfo, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateInfo = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email required';

    if (hasPhysicalItems) {
      if (!formData.phoneNumber?.trim()) errs.phoneNumber = 'Phone number required';
      if (!formData.shippingAddress?.trim()) errs.shippingAddress = 'Shipping address required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInfo()) {
      setStep('payment');
    }
  };

  const handleFinalizePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        customer: formData,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          thumbnail: item.product.thumbnail || item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          isPhysical: item.product.isPhysical,
        })),
        subtotal,
        discount: discountAmount,
        discountCode,
        shippingFee,
        total,
        paymentMethod,
        paymentStatus: 'paid',
      };

      const res = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        setStep('success');
        clearCart();
      } else {
        alert(data.message || 'Error placing order');
      }
    } catch (err) {
      alert('Network error while placing order');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (completedOrder?.orderNumber && typeof window !== 'undefined') {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="absolute inset-0" onClick={() => setIsCheckoutOpen(false)} />

      <div className="relative w-full max-w-xl bg-[#141414] border border-white/15 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-heading font-black uppercase text-white tracking-widest">
              {step === 'success' ? 'ORDER CONFIRMED' : 'CHECKOUT'}
            </h3>
            <p className="text-xs text-white/40 font-mono mt-0.5">
              {step === 'info' && '1. Contact & Shipping Details'}
              {step === 'payment' && '2. Payment Selection'}
              {step === 'success' && 'Receipt & Confirmation'}
            </p>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: INFO FORM */}
          {step === 'info' && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.email}</p>}
                </div>
              </div>

              {hasPhysicalItems && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="+855 12 345 678"
                        className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                      />
                      {errors.phoneNumber && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                        City / Province
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Phnom Penh"
                        className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                      Shipping Street Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      placeholder="Street, House No., Khan/District..."
                      className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                    />
                    {errors.shippingAddress && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.shippingAddress}</p>}
                  </div>
                </>
              )}

              {/* Digital Sync Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    Discord Username
                  </label>
                  <input
                    type="text"
                    value={formData.discordTag}
                    onChange={(e) => handleInputChange('discordTag', e.target.value)}
                    placeholder="username"
                    className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    Citizen ID (In-game)
                  </label>
                  <input
                    type="text"
                    value={formData.citizenId}
                    onChange={(e) => handleInputChange('citizenId', e.target.value)}
                    placeholder="e.g. CID-1042"
                    className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black hover:bg-white/90 font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  <span>CONTINUE TO PAYMENT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment selector */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khqr')}
                  className={`p-3 text-center border transition-all ${
                    paymentMethod === 'khqr' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  KHQR / ABA Bank
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 text-center border transition-all ${
                    paymentMethod === 'card' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  Card (Stripe)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 text-center border transition-all ${
                    paymentMethod === 'crypto' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  Crypto USDT
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 text-center border transition-all ${
                    paymentMethod === 'paypal' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  PayPal
                </button>
              </div>

              {/* Dynamic QR / Card details */}
              {paymentMethod === 'khqr' && (
                <div className="p-5 bg-[#1A1A1A] border border-white/10 text-center space-y-3">
                  <div className="mx-auto w-44 h-44 bg-white p-2 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=VTBRP-PAY-${total}USD`}
                      alt="KHQR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-mono space-y-1">
                    <p className="text-white">Scan with Bakong / ABA / Any Cambodian Bank</p>
                    <p className="text-white/50">Amount: <strong>${total.toFixed(2)} USD</strong> (≈ {(total * 4100).toLocaleString()} ៛)</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-[#1A1A1A] border border-white/10 text-xs font-mono">
                  <div>
                    <label className="block text-white/50 uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      className="w-full bg-[#111111] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 uppercase mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-[#111111] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 uppercase mb-1">CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-[#111111] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 bg-[#1A1A1A] border border-white/10 text-xs font-mono space-y-2">
                  <div className="text-white uppercase font-bold">USDT (TRC-20) Address:</div>
                  <div className="p-2.5 bg-black border border-white/10 break-all text-white/80 select-all">
                    TX9vTBRoleplayOfficialTronAddress2026Crypto
                  </div>
                  <p className="text-white/40 text-[11px]">Send exactly ${total.toFixed(2)} USDT.</p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-[#1A1A1A] border border-white/10 text-center text-xs font-mono text-white/60">
                  Redirect to PayPal gateway upon confirmation.
                </div>
              )}

              {/* Order total summary */}
              <div className="p-3 bg-white/5 border border-white/10 text-xs font-mono flex justify-between items-center">
                <span className="text-white/60">Total Due:</span>
                <span className="text-white font-bold text-sm">${total.toFixed(2)} USD</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-3.5 border border-white/20 text-white font-mono text-xs uppercase hover:bg-white/10"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleFinalizePayment}
                  disabled={loading}
                  className="flex-1 py-3.5 bg-white text-black hover:bg-white/90 font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>CONFIRM ORDER</span>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && completedOrder && (
            <div className="py-6 text-center space-y-6 font-mono">
              <div className="w-12 h-12 rounded-full border border-white mx-auto flex items-center justify-center text-white">
                <Check className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-heading font-black uppercase text-white tracking-widest">
                  THANK YOU FOR YOUR ORDER
                </h3>
                <p className="text-xs text-white/50">
                  A receipt has been dispatched to {completedOrder.customer.email}
                </p>
              </div>

              <div className="p-4 bg-[#1A1A1A] border border-white/10 space-y-1 inline-block text-left min-w-[280px]">
                <span className="text-[10px] text-white/40 uppercase block">Order Number</span>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white font-bold text-sm">{completedOrder.orderNumber}</span>
                  <button onClick={handleCopyOrderNumber} className="text-white/60 hover:text-white">
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-8 py-3.5 border border-white text-white font-heading font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
