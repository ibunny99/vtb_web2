'use client';
import React, { useEffect, useRef, useState } from 'react';

interface StatItemData {
  value: string;
  suffix: string;
  label: string;
}

const defaultStats: StatItemData[] = [
  {
    value: '>2',
    suffix: ' K players',
    label: 'Registered Citizens / គណនីចុះឈ្មោះ',
  },
  {
    value: '>500',
    suffix: ' K hrs',
    label: 'Play Hours / ម៉ោងលេង',
  },
  {
    value: '700',
    suffix: ' Peak',
    label: 'Peak Players / អ្នកលេងអតិបរមា',
  },
  {
    value: '+100',
    suffix: ' Scripts',
    label: 'Custom Features / មុខងារពិសេស',
  },
];

const icons = [
  (
    <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00DCFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  (
    <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00DCFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  (
    <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00DCFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  (
    <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00DCFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
];

function StatCard({ stat, index }: { stat: StatItemData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const icon = icons[index % icons.length];

  return (
    <div
      className="relative w-full overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: '#0C0F14' }}
      />
      {/* Border overlay */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: hovered ? 'rgba(0,220,255,0.3)' : 'rgba(255,255,255,0.06)',
          WebkitMaskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)',
          maskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)',
        }}
      />
      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        <span
          className="absolute top-[-2rem] h-[calc(100%+4rem)] w-1 -translate-x-12 skew-x-[-12deg] bg-white/20 blur-[10px]"
          style={{
            left: 0,
            animation: hovered ? 'shineOnce 2.8s forwards' : 'none',
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center gap-2.5 px-6 py-8">
        <div
          className="transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0.6, transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
        >
          {icon}
        </div>
        <span>
          <span
            className="font-heading font-bold leading-none text-white whitespace-nowrap"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
          >
            {stat.value}
          </span>
          {stat.suffix && (
            <span
              className="font-heading font-bold"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: '#00DCFF' }}
            >
              {stat.suffix}
            </span>
          )}
        </span>
        <span
          className="mt-1 block text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {stat.label}
        </span>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [statsTitle, setStatsTitle] = useState('Key Milestones / សមិទ្ធផល');
  const [statsDesc, setStatsDesc] = useState(
    'Proven track record of quality, performance, and vibrant community roleplay.'
  );
  const [statList, setStatList] = useState<StatItemData[]>(defaultStats);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          if (d.data.home?.statsTitle) setStatsTitle(d.data.home.statsTitle);
          if (d.data.home?.statsDescription) setStatsDesc(d.data.home.statsDescription);
          if (d.data.statsList && d.data.statsList.length > 0) {
            setStatList(d.data.statsList);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="container-wide">
      <div data-reveal className="mb-10 mt-16 text-center">
        <h2
          className="mb-4 leading-[1.1] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
        >
          {statsTitle}
        </h2>
        <p
          className="mx-auto max-w-[560px] text-base leading-[1.7]"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {statsDesc}
        </p>
      </div>
      <div
        data-reveal
        className="grid grid-cols-2 gap-4 py-4 pb-8 md:grid-cols-4"
        style={{ transitionDelay: '0.1s' }}
      >
        {statList.map((stat, idx) => (
          <StatCard key={stat.label || idx} stat={stat} index={idx} />
        ))}
      </div>
    </div>
  );
}
