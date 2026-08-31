'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { DEFAULT_PRODUCTS, ProductItem } from '@/lib/shop-data';

export default function ShopCatalogPage() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/shop/products')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products) && d.products.length > 0) {
          setProducts(d.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'merch', label: 'Tops & Merch' },
    { id: 'membership', label: 'Queue Priority & VIP' },
    { id: 'bundle', label: 'Starter Packs' },
    { id: 'service', label: 'Custom Services' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.category === selectedCategory;
    });
  }, [products, selectedCategory]);

  const heroDrop = products.find((p) => p.slug === 'vtb-official-cyber-tee-2026') || products[0];

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-28 pb-24 font-sans selection:bg-[#00DCFF] selection:text-black">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 xl:px-12 space-y-20">
        {/* HERO SECTION: LATEST DROP (Matching Reference Screenshot 2) */}
        {heroDrop && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Large Showcase Image */}
            <div className="lg:col-span-7">
              <Link
                href={`/shop/${heroDrop.slug}`}
                className="relative block aspect-[4/3] sm:aspect-[16/10] w-full bg-[#1A1A1A] overflow-hidden rounded-sm group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroDrop.images[0] || heroDrop.thumbnail}
                  alt={heroDrop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </Link>
            </div>

            {/* Right: Clean Hero Content */}
            <div className="lg:col-span-5 space-y-6">
              {/* Overline with accent bar */}
              <div className="space-y-2">
                <div className="w-8 h-[2px] bg-[#C8A870]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#C8A870] block">
                  LATEST DROP
                </span>
              </div>

              {/* Title */}
              <Link href={`/shop/${heroDrop.slug}`} className="block no-underline">
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-none hover:text-white/80 transition-colors">
                  {heroDrop.name}
                </h1>
              </Link>

              {/* Short Refined Description */}
              <p className="text-sm sm:text-base text-white/60 font-sans leading-relaxed max-w-lg">
                {heroDrop.shortDescription}
              </p>

              {/* Price & Inline CTA */}
              <div className="pt-2 flex items-center gap-6">
                <span className="font-heading font-black text-2xl text-[#C8A870]">
                  ${heroDrop.price}.00
                </span>

                <Link
                  href={`/shop/${heroDrop.slug}`}
                  className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white hover:text-[#C8A870] transition-colors inline-flex items-center gap-2 no-underline"
                >
                  <span>SHOP NOW</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* CATALOG GRID: FEATURED */}
        <div className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase text-white tracking-wider">
                FEATURED
              </h2>
              <p className="text-xs text-white/40 font-mono mt-0.5">
                Curated picks from the collection
              </p>
            </div>

            {/* Category Filter Links */}
            <div className="flex items-center gap-4 overflow-x-auto pb-1 text-xs font-mono uppercase tracking-wider">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap transition-colors ${
                      active ? 'text-white font-bold border-b border-white pb-0.5' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
