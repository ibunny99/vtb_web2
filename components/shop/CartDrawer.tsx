'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discountCode,
    discountPercent,
    discountAmount,
    applyDiscountCode,
    removeDiscountCode,
    total,
    itemCount,
    hasPhysicalItems,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyDiscountCode(inputCode);
    setCodeMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setInputCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col z-10">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-black uppercase text-white tracking-widest">
                YOUR BAG ({itemCount})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 font-mono">
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Your shopping bag is empty
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 border border-white/30 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="p-3 bg-[#1A1A1A] border border-white/5 flex gap-3.5 items-center relative"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-[#111111] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.thumbnail || item.product.images[0] || '/v1b-logo.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-heading font-bold text-xs uppercase text-white truncate">
                      {item.product.name}
                    </h4>

                    {/* Variants badges (Size, Color) */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                      {item.selectedSize && <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>• {item.selectedColor}</span>}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-xs font-semibold text-white">
                        ${item.product.price * item.quantity}.00
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-white/15">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeItem(item.product.id, item.selectedSize, item.selectedColor)
                    }
                    className="text-white/30 hover:text-white transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#111111] space-y-4">
              {/* Voucher / Promo code input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. IBUNNY)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 uppercase font-mono focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 border border-white/30 hover:border-white text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {discountCode && (
                  <div className="flex items-center justify-between text-[11px] text-[#10B981] font-mono pt-1">
                    <span>Applied: <strong>{discountCode}</strong> (-{discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-white/40 hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal:</span>
                  <span className="text-white">${subtotal}.00</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981]">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total:</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-white text-black hover:bg-white/90 font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <span>CHECKOUT • ${total.toFixed(2)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
