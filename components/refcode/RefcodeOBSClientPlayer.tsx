'use client';

import React, { useState, useEffect } from 'react';
import LottieRefcodePlayer from '@/components/refcode/LottieRefcodePlayer';
import { formatHashOrNumericRefcode } from '@/lib/refcode-lottie';

interface RefcodeOBSClientPlayerProps {
  initialCode: string;
  initialTitle?: string;
  boxColor?: string;
  textColor?: string;
  titleColor?: string;
  codeFont?: string;
  titleFont?: string;
}

export default function RefcodeOBSClientPlayer({
  initialCode,
  initialTitle = 'REFCODE',
  boxColor = '#00DCFF',
  textColor = '#000000',
  titleColor = '#FFFFFF',
  codeFont = '1FTV VIP Sakana',
  titleFont = '1FTV VIP Sakana',
}: RefcodeOBSClientPlayerProps) {
  const [activeCode, setActiveCode] = useState<string>(() => {
    return formatHashOrNumericRefcode(initialCode) || initialCode || 'Ibunny';
  });
  const [activeTitle, setActiveTitle] = useState<string>(initialTitle || 'REFCODE');

  useEffect(() => {
    const parseFromLocation = () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash ? window.location.hash.trim() : '';
      const pathname = window.location.pathname ? window.location.pathname.trim() : '';

      // 1. Check full URL combinations with id# (e.g. /refcode/id#12345678)
      if (pathname.includes('/id') && hash) {
        const hashFormatted = formatHashOrNumericRefcode(hash);
        if (hashFormatted) {
          setActiveCode(hashFormatted);
          setActiveTitle('REFCODE');
          return;
        }
      }

      // 2. Check hash standalone (e.g. #12345678, id#12345678, #id12345678)
      if (hash) {
        const formatted = formatHashOrNumericRefcode(hash);
        if (formatted) {
          setActiveCode(formatted);
          setActiveTitle('REFCODE');
          return;
        }

        // Custom string hash e.g. #VIPCODE or #idVIP
        if (hash.length > 1) {
          const rawCustom = decodeURIComponent(hash.slice(1)).trim().slice(0, 16);
          if (rawCustom) {
            setActiveCode(rawCustom.startsWith('#') ? rawCustom : `#${rawCustom}`);
            setActiveTitle('REFCODE');
            return;
          }
        }
      }

      // 3. Check pathname (e.g. /refcode/id#1234, /refcode/id12345678, /refcode/id-12345678, /refcode/12345678)
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && pathParts[0] === 'refcode') {
        const lastPart = pathParts[1];
        const formattedPathCode = formatHashOrNumericRefcode(lastPart);
        if (formattedPathCode) {
          setActiveCode(formattedPathCode);
          setActiveTitle('REFCODE');
          return;
        }
      }

      // Fallback to initialCode
      const formattedInitial = formatHashOrNumericRefcode(initialCode);
      if (formattedInitial) {
        setActiveCode(formattedInitial);
        setActiveTitle(initialTitle || 'REFCODE');
      } else if (initialCode) {
        setActiveCode(initialCode);
        setActiveTitle(initialTitle || 'REFCODE');
      }
    };

    parseFromLocation();
    window.addEventListener('hashchange', parseFromLocation);
    window.addEventListener('popstate', parseFromLocation);
    return () => {
      window.removeEventListener('hashchange', parseFromLocation);
      window.removeEventListener('popstate', parseFromLocation);
    };
  }, [initialCode, initialTitle]);

  return (
    <div
      style={{ background: 'transparent', backgroundColor: 'transparent' }}
      className="w-screen h-screen m-0 p-0 overflow-hidden flex items-center justify-center select-none bg-transparent"
    >
      <div className="w-full h-full max-w-[1024px] max-h-[1024px] aspect-square flex items-center justify-center p-0 m-0">
        <LottieRefcodePlayer
          code={activeCode}
          title={activeTitle}
          boxColor={boxColor}
          textColor={textColor}
          titleColor={titleColor}
          codeFont={codeFont}
          titleFont={titleFont}
          loop={true}
          autoplay={true}
          renderer="svg"
          pauseDelaySec={0}
          transparentBg={true}
          aspectRatio="aspect-square"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
