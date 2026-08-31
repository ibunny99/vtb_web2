'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import {
  customizeRefcodeLottie,
  RefcodeCustomOptions,
} from '@/lib/refcode-lottie';
import { RotateCcw, Play, Pause, Sparkles } from 'lucide-react';

interface LottieRefcodePlayerProps {
  code: string;
  title?: string;
  boxColor?: string;
  textColor?: string;
  titleColor?: string;
  codeFont?: string;
  titleFont?: string;
  hasShadow?: boolean;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-square' or 'aspect-[9/16]'
  pauseDelaySec?: number; // Delay before replay in seconds (0 = immediate infinite loop)
  loop?: boolean;
  autoplay?: boolean;
  renderer?: 'canvas' | 'svg';
  transparentBg?: boolean;
  showControls?: boolean;
  onLoaded?: () => void;
}

export default function LottieRefcodePlayer({
  code,
  title = 'REFCODE',
  boxColor = '#00DCFF',
  textColor = '#000000',
  titleColor = '#FFFFFF',
  codeFont = '1FTV VIP Sakana',
  titleFont = '1FTV VIP Sakana',
  hasShadow = true,
  className = '',
  aspectRatio = 'aspect-square',
  pauseDelaySec = 0, // 0 = seamless infinite loop
  loop = true,
  autoplay = true,
  renderer = 'svg', // SVG is much smoother and vector-crisp for OBS
  transparentBg = false,
  showControls = false,
  onLoaded,
}: LottieRefcodePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animItemRef = useRef<AnimationItem | null>(null);
  const rawLottieDataRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [error, setError] = useState<string | null>(null);

  const initAnimation = useCallback(
    async (baseData: any, options: RefcodeCustomOptions) => {
      if (!containerRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (animItemRef.current) {
        animItemRef.current.destroy();
        animItemRef.current = null;
      }

      // Preload Sakana font explicitly using FontFace API with bold weights
      if (typeof document !== 'undefined') {
        try {
          const fontsToLoad = ['1FTVVIPSakana-Regular', '1FTV VIP Sakana'];
          await Promise.all(
            fontsToLoad.map((f) =>
              Promise.all([
                document.fonts.load(`bold 120px "${f}"`).catch(() => null),
                document.fonts.load(`900 120px "${f}"`).catch(() => null),
                document.fonts.load(`normal 120px "${f}"`).catch(() => null),
              ])
            )
          );
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      try {
        setLoading(true);
        // Mutate Lottie JSON dynamically with customized text & adaptive box geometry
        const dynamicLottieData = customizeRefcodeLottie(baseData, options);

        const instance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: renderer,
          loop: loop && pauseDelaySec === 0,
          autoplay: autoplay,
          animationData: dynamicLottieData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            clearCanvas: true,
            progressiveLoad: false,
            hideOnTransparent: true,
          },
        });

        // Set smooth playback speed
        instance.setSpeed(1);
        animItemRef.current = instance;
        setIsPlaying(autoplay);

        instance.addEventListener('DOMLoaded', () => {
          setLoading(false);
          if (onLoaded) onLoaded();

          // Force SVG text elements to re-paint with the correct font after lottie creates the DOM
          if (containerRef.current) {
            const container = containerRef.current;
            const applyFontFix = () => {
              const svgTexts = container.querySelectorAll('text, tspan');
              svgTexts.forEach((el) => {
                const current = (el as SVGTextElement).style.fontFamily;
                (el as SVGTextElement).style.fontFamily = '';
                requestAnimationFrame(() => {
                  (el as SVGTextElement).style.fontFamily = current;
                });
              });
            };
            // Apply after a short delay to let the first frame render
            setTimeout(applyFontFix, 50);
          }
        });

        // Loop handling
        instance.addEventListener('complete', () => {
          setIsPlaying(false);
          if (loop) {
            if (pauseDelaySec > 0) {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                if (animItemRef.current) {
                  animItemRef.current.goToAndPlay(0, true);
                  setIsPlaying(true);
                }
              }, pauseDelaySec * 1000);
            } else {
              if (animItemRef.current) {
                animItemRef.current.goToAndPlay(0, true);
                setIsPlaying(true);
              }
            }
          }
        });

        instance.addEventListener('data_failed', () => {
          setError('Không thể tải file Lottie');
          setLoading(false);
        });
      } catch (err: any) {
        console.error('Lottie refcode player init error:', err);
        setError('Lỗi khi khởi tạo animation');
        setLoading(false);
      }
    },
    [renderer, loop, autoplay, pauseDelaySec, onLoaded]
  );

  // 1. Initial fetch of raw Lottie JSON
  useEffect(() => {
    let isMounted = true;

    async function loadJson() {
      try {
        const res = await fetch('/animations/refcode-vtb.json');
        if (!res.ok) {
          throw new Error(`Failed to load Lottie: ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          rawLottieDataRef.current = data;
          initAnimation(data, {
            code,
            title,
            boxColor,
            textColor,
            titleColor,
            codeFont,
            titleFont,
          });
        }
      } catch (err: any) {
        console.error('Error fetching refcode-vtb.json:', err);
        if (isMounted) {
          setError('Không thể tải file animation refcode-vtb.json');
          setLoading(false);
        }
      }
    }

    loadJson();

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animItemRef.current) {
        animItemRef.current.destroy();
        animItemRef.current = null;
      }
    };
  }, []); // Run once on mount

  // 2. Re-trigger animation when code/title/boxColor/fonts change
  useEffect(() => {
    if (rawLottieDataRef.current) {
      initAnimation(rawLottieDataRef.current, {
        code,
        title,
        boxColor,
        textColor,
        titleColor,
        codeFont,
        titleFont,
      });
    }
  }, [code, title, boxColor, textColor, titleColor, codeFont, titleFont, initAnimation]);

  const handleReplay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animItemRef.current) {
      animItemRef.current.goToAndPlay(0, true);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (!animItemRef.current) return;
    if (isPlaying) {
      animItemRef.current.pause();
      setIsPlaying(false);
    } else {
      animItemRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden select-none ${
        transparentBg
          ? 'bg-transparent'
          : 'rounded-2xl bg-gradient-to-b from-[#161B24] to-[#0D1016] border border-white/10'
      } flex items-center justify-center ${className}`}
    >
      {/* Loading Skeleton Overlay (hidden if transparent OBS mode) */}
      {loading && !transparentBg && (
        <div className="absolute inset-0 z-20 bg-[#0F1217] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-[#00DCFF] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-[#00DCFF] animate-pulse flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Đang nạp hiệu ứng Ref Code...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !transparentBg && (
        <div className="absolute inset-0 z-20 bg-[#0F1217]/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-red-400 font-bold mb-2 text-sm">⚠️ Lỗi Lottie Refcode</div>
          <div className="text-xs text-white/60 font-mono">{error}</div>
        </div>
      )}

      {/* Lottie Container with GPU Hardware Acceleration & Rich Drop Shadow */}
      <div
        ref={containerRef}
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          filter: hasShadow
            ? 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))'
            : 'none',
        }}
        className="w-full h-full flex items-center justify-center [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:object-contain [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
      />

      {/* Optional Interactive Controls Overlay */}
      {showControls && !transparentBg && (
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReplay}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
