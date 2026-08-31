'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import logoh from '@/assets/v1b-logo.png';

// ─── Clip-path polygon helpers ───────────────────────────────────────────────
const DENT = '9px';
const clipAll = `polygon(
  0 ${DENT},
  ${DENT} 0,
  calc(100% - ${DENT}) 0,
  100% ${DENT},
  100% calc(100% - ${DENT}),
  calc(100% - ${DENT}) 100%,
  ${DENT} 100%,
  0 calc(100% - ${DENT})
)`;
const clipAllBorder = `polygon(
  evenodd,
  0 ${DENT},
  ${DENT} 0,
  calc(100% - ${DENT}) 0,
  100% ${DENT},
  100% calc(100% - ${DENT}),
  calc(100% - ${DENT}) 100%,
  ${DENT} 100%,
  0 calc(100% - ${DENT}),
  0 ${DENT},
  1px calc(${DENT} + 0.414px),
  calc(${DENT} + 0.414px) 1px,
  calc(100% - ${DENT} - 0.414px) 1px,
  calc(100% - 1px) calc(${DENT} + 0.414px),
  calc(100% - 1px) calc(100% - ${DENT} - 0.414px),
  calc(100% - ${DENT} - 0.414px) calc(100% - 1px),
  calc(${DENT} + 0.414px) calc(100% - 1px),
  1px calc(100% - ${DENT} - 0.414px),
  1px calc(${DENT} + 0.414px)
)`;

const DENT_CARD = '24px';
const clipCard = `polygon(
  0 ${DENT_CARD},
  ${DENT_CARD} 0,
  calc(100% - ${DENT_CARD}) 0,
  100% ${DENT_CARD},
  100% calc(100% - ${DENT_CARD}),
  calc(100% - ${DENT_CARD}) 100%,
  ${DENT_CARD} 100%,
  0 calc(100% - ${DENT_CARD})
)`;
const clipCardBorder = `polygon(
  evenodd,
  0 ${DENT_CARD},
  ${DENT_CARD} 0,
  calc(100% - ${DENT_CARD}) 0,
  100% ${DENT_CARD},
  100% calc(100% - ${DENT_CARD}),
  calc(100% - ${DENT_CARD}) 100%,
  ${DENT_CARD} 100%,
  0 calc(100% - ${DENT_CARD}),
  0 ${DENT_CARD},
  1px calc(${DENT_CARD} + 0.414px),
  calc(${DENT_CARD} + 0.414px) 1px,
  calc(100% - ${DENT_CARD} - 0.414px) 1px,
  calc(100% - 1px) calc(${DENT_CARD} + 0.414px),
  calc(100% - 1px) calc(100% - ${DENT_CARD} - 0.414px),
  calc(100% - ${DENT_CARD} - 0.414px) calc(100% - 1px),
  calc(${DENT_CARD} + 0.414px) calc(100% - 1px),
  1px calc(100% - ${DENT_CARD} - 0.414px),
  1px calc(${DENT_CARD} + 0.414px)
)`;

// ─── Discord Icon SVG ─────────────────────────────────────────────────────────
function DiscordIcon() {
  return (
    <svg width="24" height="24" viewBox="0 -28.5 256 256" fill="currentColor" className="relative z-10 flex-shrink-0 text-white">
      <path d="M216.856,16.597C200.285,8.843 182.566,3.208 164.042,0C161.767,4.113 159.109,9.645 157.276,14.046C137.584,11.085 118.073,11.085 98.743,14.046C96.911,9.645 94.193,4.113 91.897,0C73.353,3.208 55.613,8.864 39.042,16.638C5.618,67.147 -3.443,116.401 1.087,164.956C23.256,181.511 44.74,191.568 65.862,198.149C71.077,190.971 75.728,183.341 79.735,175.3C72.104,172.401 64.795,168.822 57.889,164.668C59.721,163.311 61.513,161.891 63.245,160.431C105.367,180.133 151.135,180.133 192.755,160.431C194.506,161.891 196.298,163.311 198.11,164.668C191.184,168.843 183.855,172.421 176.224,175.321C180.23,183.341 184.862,190.992 190.097,198.169C211.239,191.588 232.743,181.532 254.912,164.956C260.228,108.668 245.831,59.866 216.856,16.597ZM85.474,135.095C72.829,135.095 62.459,123.29 62.459,108.915C62.459,94.54 72.608,82.715 85.474,82.715C98.341,82.715 108.71,94.519 108.489,108.915C108.509,123.29 98.341,135.095 85.474,135.095ZM170.525,135.095C157.88,135.095 147.511,123.29 147.511,108.915C147.511,94.54 157.659,82.715 170.525,82.715C183.392,82.715 193.761,94.519 193.54,108.915C193.54,123.29 183.392,135.095 170.525,135.095Z" />
    </svg>
  );
}

// ─── Login Card ───────────────────────────────────────────────────────────────
function LoginCard() {
  return (
    <div className="relative w-full max-w-[420px]">
      {/* Card container with clip-path corners */}
      <div className="relative isolate block w-full">
        {/* Card background */}
        <div
          className="absolute inset-0 pointer-events-none -z-20"
          style={{ clipPath: clipCard, backgroundColor: '#161B24' }}
        />
        
        {/* Card border gradient (top-left fade) */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            clipPath: clipCardBorder,
            background: 'rgba(255,255,255,0.06)',
            WebkitMaskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)',
            maskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)'
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex flex-col items-center px-10 py-12 text-center">
          {/* Logo */}
          <Image
            src={logoh as StaticImageData}
            alt="VTB ROLEPLAY"
            className="mb-6 h-auto w-[130px] object-contain"
          />

          {/* Heading */}
          <h1 className="mb-3 font-heading text-[1.75rem] font-bold uppercase text-white">
            Welcome to VTB RP
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-sm leading-relaxed text-[rgba(255,255,255,0.6)]">
            Sign in with your Discord account to access your dashboard and community whitelist portal. / ចូលគណនី Discord របស់អ្នកដើម្បីចូលប្រើប្រាស់។
          </p>

          {/* Discord Login Button */}
          <div className="block w-full">
            <div
              className="group isolate relative flex w-full cursor-pointer items-center justify-center gap-3 px-6 py-4 transition-colors duration-200 active:scale-[0.97] transition-transform"
              style={{
                ['--dentSize-tl' as string]: '9px',
                ['--dentSize-tr' as string]: '9px',
                ['--dentSize-bl' as string]: '9px',
                ['--dentSize-br' as string]: '9px'
              }}
            >
              {/* Button bg */}
              <div
                className="absolute inset-0 pointer-events-none -z-20 transition-colors group-hover:bg-[#404EED]"
                style={{ clipPath: clipAll, backgroundColor: '#5865F2' }}
              />
              
              {/* Button border */}
              <div
                className="absolute inset-0 pointer-events-none -z-10 transition-colors group-hover:bg-[rgba(88,101,242,0.8)]"
                style={{ clipPath: clipAllBorder, backgroundColor: 'rgba(88,101,242,0.4)' }}
              />
              
              <DiscordIcon />
              <span className="relative z-10 font-heading text-sm font-bold uppercase text-white">
                Login with Discord / ចូលគណនី
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-[0.6875rem] leading-relaxed text-[rgba(255,255,255,0.35)]">
            We only use Discord for secure authentication. We will never access your private messages or personal data.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div
      className="flex-1 flex flex-col"
      style={{ ['--site-sticky-top' as string]: '72px', ['--site-sticky-top-md' as string]: '92px' }}
    >
      {/* Spacer for fixed navbar */}
      <div className="h-[72px] md:h-[92px]" />

      <div className="flex flex-1 items-center justify-center px-4 py-12 md:py-16">
        <LoginCard />
      </div>
    </div>
  );
}
