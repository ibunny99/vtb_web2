'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { SizeMeasurement } from '@/lib/shop-data';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  sizeChart: SizeMeasurement[];
}

export default function SizeChartModal({
  isOpen,
  onClose,
  productName,
  sizeChart = [],
}: SizeChartModalProps) {
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      {/* Backdrop click outside */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#121620] border border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#00DCFF] to-transparent" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00DCFF]/15 border border-[#00DCFF]/40 flex items-center justify-center text-[#00DCFF]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black uppercase text-white tracking-wide">
                Size Guide & Measurement Chart
              </h3>
              <p className="text-xs text-white/60 font-mono">
                {productName} • Oversized Streetwear Fit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Fit Recommendation Note */}
          <div className="p-4 rounded-2xl bg-[#161B24] border border-[#00DCFF]/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#00DCFF] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-white/80">
              <span className="font-heading font-bold uppercase text-[#00DCFF] block">
                Streetwear Oversized Fit / ទំហំបែប Oversized
              </span>
              <p>
                Our tee is tailored with a relaxed drop-shoulder streetwear cut. If you prefer a standard/fitted look, please choose <strong>one size smaller</strong> than your normal size.
              </p>
            </div>
          </div>

          {/* Measurement Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#1A2230] text-white/60 uppercase font-heading tracking-wider border-b border-white/10">
                  <th className="p-3.5 font-extrabold text-[#00DCFF]">Size</th>
                  <th className="p-3.5">Chest (Ngực)</th>
                  <th className="p-3.5">Length (Dài)</th>
                  <th className="p-3.5">Shoulder (Vai)</th>
                  <th className="p-3.5">Recommended Weight</th>
                  <th className="p-3.5">Recommended Height</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-white/85">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-heading font-black text-sm text-[#00DCFF]">
                      {row.size}
                    </td>
                    <td className="p-3.5">{row.chest}</td>
                    <td className="p-3.5">{row.length}</td>
                    <td className="p-3.5">{row.shoulder}</td>
                    <td className="p-3.5 text-white/70">{row.recommendedWeight}</td>
                    <td className="p-3.5 text-white/70">{row.recommendedHeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/60 font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00DCFF]" /> 1. Chest Width
              </div>
              <p>Measure across the fullest part of your chest, keeping the tape horizontal.</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00DCFF]" /> 2. Body Length
              </div>
              <p>Measure from the highest point of the shoulder seam down to the bottom hem.</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00DCFF]" /> 3. Shoulder
              </div>
              <p>Measure from one shoulder seam point across the back to the opposite point.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0B0E14] border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
          <span>Need fit assistance? Contact support on Discord.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00DCFF] text-black font-heading font-extrabold text-xs uppercase tracking-wide hover:bg-[#52F0FF] transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
