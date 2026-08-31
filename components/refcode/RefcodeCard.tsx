'use client';

import React, { useState } from 'react';
import LottieRefcodePlayer from './LottieRefcodePlayer';
import { RefcodeItem } from '@/lib/refcode-lottie';
import {
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Gift,
  Share2,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface RefcodeCardProps {
  item: RefcodeItem;
  className?: string;
  isCMSPreview?: boolean;
}

export default function RefcodeCard({
  item,
  className = '',
  isCMSPreview = false,
}: RefcodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const displayCode = item.code || 'Ibunny';
  const displayTitle = item.title || 'REFCODE';
  const displayOwner = item.owner || 'VTB RP Community / សហគមន៍ VTB RP';
  const displayReward =
    item.reward || 'Enter this code in-game or Discord to claim exclusive rewards! / បញ្ចូលកូដនេះដើម្បីទទួលរង្វាន់!';
  const targetUrl = item.targetUrl || 'https://discord.gg/vtbrp';

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/refcode/${item.slug || displayCode}`;
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/refcode/${item.slug || displayCode}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `VTB RP Referral Code - ${displayCode}`,
            text: `Use referral code ${displayCode} for exclusive gifts on VTB Roleplay server!`,
            url: url,
          });
        } catch {
          handleCopyLink();
        }
      } else {
        handleCopyLink();
      }
    }
  };

  return (
    <div
      className={`relative w-full max-w-lg mx-auto bg-[#12161F]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden ${className}`}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-24 -left-24 w-60 h-60 rounded-full blur-[90px] pointer-events-none opacity-25"
        style={{ backgroundColor: item.boxColor || '#00DCFF' }}
      />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-[#00DCFF] blur-[90px] pointer-events-none opacity-20" />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#00DCFF]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/90">
            {displayTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
          <Users className="w-3.5 h-3.5 text-[#00DCFF]" />
          <span>{displayOwner}</span>
        </div>
      </div>

      {/* Lottie Animation Display (Dynamic Text & Auto-Stretching Box) */}
      <div className="relative z-10 my-2 shadow-2xl rounded-2xl overflow-hidden group">
        <LottieRefcodePlayer
          code={displayCode}
          title={displayTitle}
          boxColor={item.boxColor || '#00DCFF'}
          textColor={item.textColor || '#000000'}
          titleColor={item.titleColor || '#FFFFFF'}
          codeFont={item.codeFont || '1FTV VIP Sakana'}
          titleFont={item.titleFont || '1FTV VIP Sakana'}
          hasShadow={true}
          showControls={true}
          pauseDelaySec={4}
          aspectRatio="aspect-square"
          className="max-h-[380px] sm:max-h-[420px]"
        />
      </div>

      {/* Reward / Info Section */}
      <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 space-y-2">
        <div className="flex items-center gap-2 text-[#00DCFF] text-xs font-bold font-heading uppercase">
          <Gift className="w-4 h-4" />
          <span>Reward Details / រង្វាន់ទទួលបាន:</span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
          {displayReward}
        </p>
      </div>

      {/* Primary Actions: Copy Refcode Button & Join Game Button */}
      <div className="mt-6 space-y-3 relative z-10">
        {/* Copy Code Button */}
        <button
          onClick={handleCopyCode}
          className="w-full group relative flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-[#00DCFF] via-[#00B4D8] to-[#0096C7] text-black font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(0,220,255,0.35)] hover:shadow-[0_0_35px_rgba(0,220,255,0.5)] active:scale-[0.98] transition-all"
        >
          <span className="flex items-center gap-2">
            {copied ? (
              <Check className="w-5 h-5 text-black animate-bounce" />
            ) : (
              <Copy className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
            )}
            <span>{copied ? 'CODE COPIED!' : 'COPY REF CODE'}</span>
          </span>

          <span className="px-3 py-1 rounded-xl bg-black/20 text-black font-mono text-xs font-black">
            {displayCode}
          </span>
        </button>

        {/* Join Server / Redirect Action */}
        {!isCMSPreview && (
          <div className="grid grid-cols-2 gap-3">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00DCFF] text-black font-heading font-bold text-xs uppercase tracking-wide hover:bg-[#52F0FF] transition-all no-underline shadow-[0_0_15px_rgba(0,220,255,0.2)]"
            >
              <span>Join Server / ចូលរួម</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-heading font-bold text-xs uppercase tracking-wide transition-all"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00DCFF]" />
                  <span className="text-[#00DCFF]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Guarantee */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/50 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified by VTB ROLEPLAY Server</span>
      </div>
    </div>
  );
}
