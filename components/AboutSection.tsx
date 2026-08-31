'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import a1 from '@/assets/1.png';
import a2 from '@/assets/2.png';
import a3 from '@/assets/2.png';

const words = [
  'A', 'city', 'where', 'relationships', 'drive', 'everything.',
  'Open', 'a', 'business,', 'supply', 'others,', 'build', 'an', 'empire.',
  'Police', 'with', 'realistic', 'tools', 'hunt', 'criminals', 'who', 'calculate', 'every', 'move.',
  'A', 'modern', 'phone,', 'a', 'living', 'economy,', 'and', 'unforgettable', 'stories', 'that',
  'players', 'and', 'audiences', 'will', 'remember', 'forever.',
];

interface FeatureCard {
  title: string;
  description: string;
  videoSrc?: string;
  photoSrc?: string | StaticImageData;
  bgColor?: string;
  origin?: string;
  hoverTransform?: string;
}

const defaultFeatures: FeatureCard[] = [
  {
    title: 'New Locations, New World',
    description:
      'Uncharted zones and exclusive map interiors built for deep exploration / តំបន់ថ្មី និងពិភពលោកថ្មីសម្រាប់អ្នករុករក។',
    photoSrc: a2,
    bgColor: 'rgb(31, 38, 51)',
    origin: 'origin-left',
    hoverTransform: 'rotateY(3deg) rotateX(1deg)',
  },
  {
    title: 'Government & Law Enforcement',
    description:
      'Rebuilt from the ground up for PD, EMS, and DOJ — streamlined workflows, MDT case files, and realistic court system / ប្រព័ន្ធប៉ូលីស ពេទ្យ និងតុលាការពេញលេញ។',
    photoSrc: a2,
    bgColor: 'rgb(51, 31, 38)',
    origin: 'origin-top',
    hoverTransform: 'rotateX(2deg)',
  },
  {
    title: 'Dynamic & Continuous RP',
    description:
      'Engaging activities around the clock — rich civilian life and thriving underworld / សកម្មភាពកម្សាន្តឥតឈប់ឈរពេញ ២៤ ម៉ោង។',
    photoSrc: a2,
    bgColor: 'rgb(31, 46, 51)',
    origin: 'origin-top',
    hoverTransform: 'rotateX(2deg)',
  },
  {
    title: 'Diverse Careers & Economy',
    description:
      'From logistics and trucking to crafting and business management / មុខរបរចម្រុះ និងសេដ្ឋកិច្ចជាក់ស្តែង។',
    photoSrc: a2,
    bgColor: 'transparent',
    origin: 'origin-right',
    hoverTransform: 'rotateY(-3deg) rotateX(1deg)',
  },
];

function VideoCard({ feature, delay = 0 }: { feature: FeatureCard; delay?: number }) {
  const originStyle = feature.origin ? feature.origin.replace('origin-', '') : 'top';
  const hoverStyle = feature.hoverTransform || 'rotateX(2deg)';

  return (
    <div
      className="group flex flex-1 flex-col gap-4"
      style={{ perspective: '800px' }}
      data-reveal
      data-delay={delay}
    >
      <div
        className="relative block min-h-[180px] flex-1 transition-transform duration-500"
        style={{
          transformOrigin: originStyle,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = hoverStyle;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'none';
        }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: feature.bgColor || 'rgb(31, 38, 51)',
          }}
        >
          {feature.videoSrc && feature.videoSrc.trim() !== '' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="block h-full w-full object-cover"
            >
              <source src={feature.videoSrc} type="video/webm" />
            </video>
          ) : feature.photoSrc ? (
            typeof feature.photoSrc === 'string' ? (
              <img
                src={feature.photoSrc}
                alt={feature.title}
                className="block h-full w-full object-cover"
              />
            ) : (
              <Image
                src={feature.photoSrc}
                alt={feature.title}
                className="block h-full w-full object-cover"
              />
            )
          ) : null}
        </div>
        {/* Border Overlay */}
        <div
          className="absolute inset-0 transition-colors duration-300 group-hover:opacity-100"
          style={{
            background: 'rgba(255,255,255,0.06)',
          }}
        />
      </div>
      <h3 className="font-heading text-[1.75rem] font-bold tracking-[-0.01em]">{feature.title}</h3>
      <p className="text-sm leading-[1.7]" style={{ color: '#999' }}>
        {feature.description}
      </p>
    </div>
  );
}

export default function AboutSection() {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [featureList, setFeatureList] = useState<FeatureCard[]>(defaultFeatures);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data && d.data.features && d.data.features.length > 0) {
          // Merge dynamic properties with default styling
          const merged = d.data.features.map((f: any, idx: number) => ({
            ...defaultFeatures[idx % defaultFeatures.length],
            ...f,
          }));
          setFeatureList(merged);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height * 0.5)));
      const totalWords = wordRefs.current.length;
      const activeCount = Math.floor(progress * totalWords * 1.5);
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i < activeCount) {
          el.style.color = 'rgba(255,255,255,0.9)';
        } else {
          el.style.color = 'rgba(255,255,255,0.1)';
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseFloat(el.dataset.delay || '0');
            setTimeout(() => {
              el.classList.add('revealed');
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="relative">
      {/* Animated text */}
      <div
        ref={sectionRef}
        className="flex min-h-[50vh] items-center"
        style={{ paddingTop: 'clamp(2rem, 4vw, 4rem)', paddingBottom: 'clamp(2rem, 4vw, 4rem)' }}
      >
        <div className="container-app flex justify-center text-center">
          <p
            className="max-w-[1100px] font-heading font-normal leading-[1.4] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => { wordRefs.current[i] = el; }}
                className="inline transition-colors duration-400"
                style={{ color: 'rgba(255,255,255,0.1)' }}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative mt-8">
        {/* Top zigzag */}
        <div className="relative -mb-px w-full leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" className="block h-12 w-full md:h-20">
            <path d="M0 80V56L36 24H200L224 0H580L604 24H836L860 0H1216L1240 24H1404L1440 56V80H0Z" fill="#0C0F14" />
          </svg>
        </div>

        <div style={{ backgroundColor: '#0C0F14', paddingBottom: '3rem', paddingTop: '2rem' }}>
          <div className="container-wide">
            {/* Section heading */}
            <div data-reveal className="mb-10 text-center">
              <h2
                className="leading-[1.1] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
              >
                Familiar.{' '}
                <span className="text-gradient">Reimagined!</span>
              </h2>
            </div>

            {/* Feature grid */}
            <div className="mb-14 flex flex-col gap-4 md:h-[650px] md:flex-row md:items-stretch">
              {/* Left column */}
              {featureList[0] && (
                <div className="flex min-w-0 flex-1 flex-col">
                  <VideoCard feature={featureList[0]} delay={0} />
                </div>
              )}

              {/* Middle column */}
              <div className="flex min-w-0 flex-1 flex-col gap-6" style={{ transitionDelay: '0.15s' }}>
                {featureList[1] && <VideoCard feature={featureList[1]} delay={0.15} />}
                {featureList[2] && <VideoCard feature={featureList[2]} delay={0.15} />}
              </div>

              {/* Right column */}
              {featureList[3] && (
                <div className="flex min-w-0 flex-1 flex-col" style={{ transitionDelay: '0.3s' }}>
                  <VideoCard feature={featureList[3]} delay={0.3} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom zigzag */}
        <div className="relative -mt-px w-full leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" className="block h-12 w-full md:h-20">
            <path d="M0 0V24L36 56H200L224 80H580L604 56H836L860 80H1216L1240 56H1404L1440 24V0H0Z" fill="#0C0F14" />
          </svg>
        </div>
      </div>
    </section>
  );
}
