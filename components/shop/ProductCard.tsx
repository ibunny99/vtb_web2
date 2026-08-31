'use client';

import React from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/shop-data';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block space-y-3 no-underline select-none"
    >
      {/* Clean Image Box */}
      <div className="relative aspect-square w-full bg-[#161616] overflow-hidden rounded-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail || product.images[0] || '/v1b-logo.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {product.isPreOrder && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] font-mono text-white/80 uppercase tracking-widest">
            PRE-ORDER
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-white/80 transition-colors uppercase truncate">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="font-sans text-xs sm:text-sm text-white/60 font-medium">
            ${product.price}.00
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-white/30 line-through">
              ${product.originalPrice}.00
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
