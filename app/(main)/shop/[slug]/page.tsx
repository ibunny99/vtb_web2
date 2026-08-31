'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Ruler, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import ProductGallery from '@/components/shop/ProductGallery';
import SizeChartModal from '@/components/shop/SizeChartModal';
import ProductCard from '@/components/shop/ProductCard';
import { DEFAULT_PRODUCTS, ProductItem, SIZE_CHART_TEE } from '@/lib/shop-data';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addItem, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'shipping' | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/api/shop/products')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products)) {
          setAllProducts(d.products);
          const found = d.products.find((p: ProductItem) => p.slug === slug || p.id === slug);
          if (found) {
            setProduct(found);
            if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0].name);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setProduct((prev) => {
          if (prev) return prev;
          const found = DEFAULT_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
          if (found) {
            if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0].name);
            return found;
          }
          return DEFAULT_PRODUCTS[0];
        });
        setLoading(false);
      });
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white pt-24 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, 1, selectedSize || undefined, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-28 pb-24 font-sans selection:bg-[#00DCFF] selection:text-black">
      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        productName={product.name}
        sizeChart={product.sizeChart || SIZE_CHART_TEE}
      />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 xl:px-12 space-y-16">
        {/* MAIN PRODUCT SECTION (Matching Reference Screenshot 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Clean Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              isPreOrder={product.isPreOrder}
            />
          </div>

          {/* Right Column: Clean Minimalist Details */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Category / Subtitle */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/50 block">
                {product.category === 'merch' ? 'TOPS / OFFICIAL MERCH' : product.categoryLabel.toUpperCase()}
              </span>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock status */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-2xl sm:text-3xl font-medium text-white">
                  ${product.price}.00
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-white/40 line-through">
                    ${product.originalPrice}.00
                  </span>
                )}
                {product.khmerPrice && (
                  <span className="text-xs text-white/50 font-mono">
                    ({product.khmerPrice})
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono tracking-wider font-semibold uppercase text-[#10B981]">
                {product.isPreOrder ? 'PRE-ORDER OPEN' : 'IN STOCK'}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/70">
                  <span>
                    SIZE: <strong className="text-white uppercase">{selectedSize}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-white/40 hover:text-white transition-colors underline text-[11px]"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[48px] h-11 px-3 rounded-md text-xs font-mono font-medium transition-all flex items-center justify-center border ${
                          isSelected
                            ? 'border-[#C8A870] bg-[#1E1E1E] text-[#C8A870] shadow-sm'
                            : 'border-white/15 bg-transparent text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector (if applicable) */}
            {product.colors && product.colors.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-white/70 block">
                  COLOR: <strong className="text-white">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? 'border-[#00DCFF] scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Clean Short Description */}
            <p className="text-sm text-white/60 font-sans leading-relaxed pt-1">
              {product.shortDescription || product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-white/10 pt-4" />

            {/* ADD TO BAG Button (Matching Reference) */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-4 rounded-none bg-transparent hover:bg-white text-white hover:text-black border border-white/30 hover:border-white font-heading font-bold text-xs uppercase tracking-[0.2em] transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>
                  {added ? 'ADDED TO BAG ✓' : product.isPreOrder ? 'PRE-ORDER NOW' : 'ADD TO BAG'}
                </span>
              </button>

              <p className="text-[11px] font-mono text-white/40 text-center">
                Free worldwide shipping included during this drop.
              </p>
            </div>

            {/* Minimal Accordion for Details & Specs */}
            <div className="border-t border-white/10 divide-y divide-white/10 pt-2 text-xs font-sans">
              {/* Accordion 1: Details & Specs */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'details' ? null : 'details')
                  }
                  className="w-full py-3.5 flex items-center justify-between text-white/80 hover:text-white uppercase font-mono tracking-wider"
                >
                  <span>Details & Fabric Specs</span>
                  {openAccordion === 'details' ? (
                    <ChevronUp className="w-4 h-4 text-white/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  )}
                </button>

                {openAccordion === 'details' && (
                  <div className="pb-4 space-y-2 text-white/60 font-sans leading-relaxed text-xs">
                    <p>{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-1">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')
                  }
                  className="w-full py-3.5 flex items-center justify-between text-white/80 hover:text-white uppercase font-mono tracking-wider"
                >
                  <span>Shipping & Pre-Order Terms</span>
                  {openAccordion === 'shipping' ? (
                    <ChevronUp className="w-4 h-4 text-white/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  )}
                </button>

                {openAccordion === 'shipping' && (
                  <div className="pb-4 space-y-1.5 text-white/60 text-xs font-sans leading-relaxed">
                    <p>
                      Pre-order production run takes approximately 2-3 weeks before final dispatch.
                    </p>
                    <p>
                      Door-to-door courier tracking provided for all domestic and international shipments.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
                  Featured
                </h2>
                <p className="text-xs text-white/40 font-mono mt-0.5">
                  Curated picks from the collection
                </p>
              </div>

              <Link
                href="/shop"
                className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
