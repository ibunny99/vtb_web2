'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProductItem, CartItem } from '@/lib/shop-data';

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductItem, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  hasPhysicalItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vtb_shop_cart_v1';
const DISCOUNT_STORAGE_KEY = 'vtb_shop_discount_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedDiscount = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      if (savedDiscount) {
        const parsed = JSON.parse(savedDiscount);
        setDiscountCode(parsed.code || '');
        setDiscountPercent(parsed.percent || 0);
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        DISCOUNT_STORAGE_KEY,
        JSON.stringify({ code: discountCode, percent: discountPercent })
      );
    } catch (e) {
      console.warn('Could not save discount to localStorage:', e);
    }
  }, [discountCode, discountPercent, isLoaded]);

  const addItem = (
    product: ProductItem,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize, selectedColor);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch {}
  };

  const applyDiscountCode = (code: string) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a voucher code' };
    }

    if (cleanCode === 'IBUNNY') {
      setDiscountCode('IBUNNY');
      setDiscountPercent(10);
      return { success: true, message: 'Applied 10% OFF from Ibunny Ref Code! / បញ្ចុះតម្លៃ 10%' };
    }

    if (cleanCode === 'VTB2026') {
      setDiscountCode('VTB2026');
      setDiscountPercent(15);
      return { success: true, message: 'Applied 15% OFF Special VTB2026 Code! / បញ្ចុះតម្លៃ 15%' };
    }

    if (cleanCode === 'TUWCOR') {
      setDiscountCode('TUWCOR');
      setDiscountPercent(15);
      return { success: true, message: 'Applied 15% OFF from Tuwcor VIP Code! / បញ្ចុះតម្លៃ 15%' };
    }

    if (cleanCode === 'VIP' || cleanCode === 'VTBRP') {
      setDiscountCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: 'Applied 10% OFF VIP discount! / បញ្ចុះតម្លៃ 10%' };
    }

    return { success: false, message: 'Invalid or expired discount code / កូដមិនត្រឹមត្រូវ' };
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const hasPhysicalItems = useMemo(() => {
    return items.some((item) => item.product.isPhysical);
  }, [items]);

  // Merch gets free shipping for pre-orders during campaign
  const shippingFee = 0;

  const discountAmount = useMemo(() => {
    if (discountPercent <= 0) return 0;
    return Math.round((subtotal * discountPercent) / 100 * 100) / 100;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    const calculated = subtotal - discountAmount + shippingFee;
    return Math.max(0, calculated);
  }, [subtotal, discountAmount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        discountCode,
        discountPercent,
        discountAmount,
        applyDiscountCode,
        removeDiscountCode,
        itemCount,
        subtotal,
        shippingFee,
        total,
        hasPhysicalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
