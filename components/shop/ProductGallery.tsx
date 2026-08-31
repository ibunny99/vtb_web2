'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isPreOrder?: boolean;
}

export default function ProductGallery({
  images = [],
  productName,
  isPreOrder,
}: ProductGalleryProps) {
  const displayImages = images.length > 0 ? images : ['/v1b-logo.png'];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="space-y-3">
      {/* Dual or Grid Image Display matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayImages.slice(0, 2).map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square w-full bg-[#161616] overflow-hidden rounded-sm group cursor-pointer"
            onClick={() => setSelectedIdx(idx)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Additional angles if more than 2 photos */}
      {displayImages.length > 2 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayImages.slice(2).map((img, idx) => (
            <div
              key={idx + 2}
              className="relative aspect-square w-full bg-[#161616] overflow-hidden rounded-sm group cursor-pointer"
              onClick={() => setSelectedIdx(idx + 2)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${productName} detail ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
