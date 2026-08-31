'use client';
import React from 'react';
import Link from 'next/link';

function HexGrid({ side }: { side: 'left' | 'right' }) {
  const hexagons =
    side === 'left'
      ? [
          [156, 68, 117, 135.5, 39, 135.5, 0, 68, 39, 0.5, 117, 0.5],
          [390, 68, 351, 135.5, 273, 135.5, 234, 68, 273, 0.5, 351, 0.5],
          [624, 68, 585, 135.5, 507, 135.5, 468, 68, 507, 0.5, 585, 0.5],
          [273, 135.5, 234, 203.1, 156, 203.1, 117, 135.5, 156, 68, 234, 68],
          [507, 135.5, 468, 203.1, 390, 203.1, 351, 135.5, 390, 68, 468, 68],
          [741, 135.5, 702, 203.1, 624, 203.1, 585, 135.5, 624, 68, 702, 68],
          [156, 203.1, 117, 270.6, 39, 270.6, 0, 203.1, 39, 135.5, 117, 135.5],
          [390, 203.1, 351, 270.6, 273, 270.6, 234, 203.1, 273, 135.5, 351, 135.5],
          [624, 203.1, 585, 270.6, 507, 270.6, 468, 203.1, 507, 135.5, 585, 135.5],
          [273, 270.6, 234, 338.2, 156, 338.2, 117, 270.6, 156, 203.1, 234, 203.1],
          [507, 270.6, 468, 338.2, 390, 338.2, 351, 270.6, 390, 203.1, 468, 203.1],
          [156, 338.2, 117, 405.7, 39, 405.7, 0, 338.2, 39, 270.6, 117, 270.6],
          [390, 338.2, 351, 405.7, 273, 405.7, 234, 338.2, 273, 270.6, 351, 270.6],
        ]
      : [
          [390, 68, 351, 135.5, 273, 135.5, 234, 68, 273, 0.5, 351, 0.5],
          [624, 68, 585, 135.5, 507, 135.5, 468, 68, 507, 0.5, 585, 0.5],
          [507, 135.5, 468, 203.1, 390, 203.1, 351, 135.5, 390, 68, 468, 68],
          [741, 135.5, 702, 203.1, 624, 203.1, 585, 135.5, 624, 68, 702, 68],
          [156, 203.1, 117, 270.6, 39, 270.6, 0, 203.1, 39, 135.5, 117, 135.5],
          [390, 203.1, 351, 270.6, 273, 270.6, 234, 203.1, 273, 135.5, 351, 135.5],
          [624, 203.1, 585, 270.6, 507, 270.6, 468, 203.1, 507, 135.5, 585, 135.5],
          [273, 270.6, 234, 338.2, 156, 338.2, 117, 270.6, 156, 203.1, 234, 203.1],
          [507, 270.6, 468, 338.2, 390, 338.2, 351, 270.6, 390, 203.1, 468, 203.1],
          [741, 270.6, 702, 338.2, 624, 338.2, 585, 270.6, 624, 203.1, 702, 203.1],
          [156, 338.2, 117, 405.7, 39, 405.7, 0, 338.2, 39, 270.6, 117, 270.6],
          [390, 338.2, 351, 405.7, 273, 405.7, 234, 338.2, 273, 270.6, 351, 270.6],
          [624, 338.2, 585, 405.7, 507, 405.7, 468, 338.2, 507, 270.6, 585, 270.6],
        ];

  const maskId = `hex-mask-${side}`;

  return (
    <div
      className="pointer-events-none absolute top-1/2 max-md:hidden"
      style={{
        transform: 'translateY(-30%)',
        opacity: 0.35,
        [side === 'left' ? 'left' : 'right']: '-250px',
      }}
      aria-hidden="true"
    >
      <div className="relative h-[750px] w-[750px]">
        <video
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="https://cdn.prodigyrp.net/website-content/Gov_Tool.webm" type="video/webm" />
        </video>
        <svg width="750" height="750" className="absolute inset-0">
          <defs>
            <mask id={maskId}>
              <rect width="750" height="750" fill="white" />
              {hexagons.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts.join(',')}
                  fill="black"
                />
              ))}
            </mask>
          </defs>
          <rect width="750" height="750" fill="#11151b" mask={`url(#${maskId})`} />
          {hexagons.map((pts, i) => (
            <polygon
              key={i}
              points={pts.join(',')}
              fill="rgba(255,255,255,0)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              className="pointer-events-auto"
              style={{ transition: 'fill 2s 0.5s ease-out, stroke 2s 0.5s ease-out' }}
              onMouseEnter={(e) => {
                (e.target as SVGPolygonElement).style.fill = 'rgba(255,255,255,0.15)';
                (e.target as SVGPolygonElement).style.stroke = 'rgba(255,255,255,0.1)';
                (e.target as SVGPolygonElement).style.transition = 'fill 0.15s ease-out, stroke 0.15s ease-out';
              }}
              onMouseLeave={(e) => {
                (e.target as SVGPolygonElement).style.fill = 'rgba(255,255,255,0)';
                (e.target as SVGPolygonElement).style.stroke = 'rgba(255,255,255,0.06)';
                (e.target as SVGPolygonElement).style.transition = 'fill 2s 0.5s ease-out, stroke 2s 0.5s ease-out';
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function ApplicationSection() {
  return (
    <section
      id="application"
      className="relative flex min-h-[560px] items-center justify-center overflow-hidden py-24"
      style={{ background: '#11151b' }}
    >
      <HexGrid side="left" />
      <HexGrid side="right" />

      <div className="relative z-[1] flex max-w-[700px] flex-col items-center px-8 text-center">
        <h2
          className="mb-6 font-heading font-bold uppercase leading-[1.2] tracking-[-0.015em] text-white"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)' }}
        >
          Got a Story?
          <br />
          <span
            style={{
              background: 'linear-gradient(180deg, #52F0FF 18.831%, #00DCFF 95.455%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Let&apos;s Write It Together
          </span>
        </h2>
        <p
          className="mb-12 max-w-[606px] leading-[1.5]"
          style={{
            fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          Built for serious roleplayers, content creators, and streamers who want a world worth sharing.
          Apply for the whitelist to start your journey in VTB Roleplay. / បង្កើតឡើងសម្រាប់អ្នកលេងតួពិតប្រាកដ។ ដាក់ពាក្យ Whitelist ដើម្បីចាប់ផ្តើមដំណើររបស់អ្នកនៅ VTB Roleplay។
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Apply Now - primary */}
          <Link href="/applications">
            <div
              className="inline-flex relative cursor-pointer items-center justify-center font-heading font-bold uppercase whitespace-nowrap text-black no-underline active:scale-[0.97] transition-transform duration-150 px-8 py-4 text-sm"
            >
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  background: 'rgba(0,56,70,0.5)',
                }}
              />
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  background: '#00DCFF',
                }}
              />
              <span className="relative z-10 inline-flex flex-row items-center gap-1.5 whitespace-nowrap font-bold text-black transition-colors">
                Apply Now / ដាក់ពាក្យ
              </span>
            </div>
          </Link>

          {/* Check the Rules - secondary */}
          <Link href="/rules">
            <div
              className="inline-flex relative cursor-pointer items-center justify-center font-heading font-bold uppercase whitespace-nowrap text-white no-underline active:scale-[0.97] transition-transform duration-150 px-8 py-4 text-sm border border-white/20 hover:border-[#00DCFF]"
            >
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  background: '#161B24',
                }}
              />
              <span className="relative z-10 inline-flex flex-row items-center gap-1.5 whitespace-nowrap transition-colors">
                Check the Rules / មើលច្បាប់
              </span>
            </div>
          </Link>
        </div>
        <span
          className="mt-6 font-heading text-[0.625rem] font-bold uppercase tracking-[0.08em]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Rules last updated: 2026
        </span>
      </div>
    </section>
  );
}
