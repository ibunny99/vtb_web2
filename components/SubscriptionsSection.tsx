'use client';
import React, { useState } from 'react';

interface Tier {
  name: string;
  color: string;
  textColor: string;
  priority: string;
  price: string;
  imgSrc: string;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: 'Silver',
    color: '#9a9a9a',
    textColor: 'rgb(192,192,192)',
    priority: '+25',
    price: '$25',
    imgSrc: 'https://prodigyrp.net/assets/silver.webp',
    features: [
      '+25 Queue Priority (stacks with other sources)',
      'Silver member badge on Discord & VTB website / ផ្លាកសញ្ញា Silver'
    ]
  },
  {
    name: 'Gold',
    color: '#d4a017',
    textColor: 'rgb(255,215,0)',
    priority: '+40',
    price: '$40',
    imgSrc: 'https://prodigyrp.net/assets/gold.webp',
    features: [
      '+40 Queue Priority (stacks with other sources)',
      'Gold member badge on Discord & VTB website / ផ្លាកសញ្ញា Gold'
    ]
  },
  {
    name: 'Emerald',
    color: '#3a9a5c',
    textColor: 'rgb(80,200,120)',
    priority: '+60',
    price: '$60',
    imgSrc: 'https://prodigyrp.net/assets/emerald.webp',
    features: [
      '+60 Queue Priority (stacks with other sources)',
      'Emerald member badge on Discord & VTB website / ផ្លាកសញ្ញា Emerald'
    ]
  },
  {
    name: 'Platinum',
    color: '#c9b8a8',
    textColor: 'rgb(224,213,201)',
    priority: '+80',
    price: '$80',
    imgSrc: 'https://prodigyrp.net/assets/platinum.webp',
    features: [
      '+80 Queue Priority (stacks with other sources)',
      'Platinum member badge on Discord & VTB website / ផ្លាកសញ្ញា Platinum'
    ]
  },
  {
    name: 'Diamond',
    color: '#5bb8d4',
    textColor: 'rgb(185,242,255)',
    priority: '+140',
    price: '$140',
    imgSrc: 'https://prodigyrp.net/assets/diamond.webp',
    features: [
      '+140 Queue Priority (stacks with other sources)',
      'Diamond member badge on Discord & VTB website / ផ្លាកសញ្ញា Diamond'
    ]
  },
  {
    name: 'Onyx',
    color: '#8B5CF6',
    textColor: 'rgb(167,139,250)',
    priority: '+250',
    price: '$250',
    imgSrc: 'https://prodigyrp.net/assets/onyx.webp',
    features: [
      '+250 Queue Priority (stacks with other sources)',
      'Onyx member badge on Discord & VTB website / ផ្លាកសញ្ញា Onyx'
    ]
  }
];


function TierCard({ tier }: {tier: Tier;}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-full transition-transform duration-300 ease-out hover:-translate-y-1"
      style={{ '--tier-color': tier.color } as React.CSSProperties}>
      
      <div
        className="relative block w-full h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
>
        
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: '#161B24' }}>
          
          <span
            className="pointer-events-none absolute left-0 top-0 h-2/5 w-1/2 opacity-10"
            style={{
              background: `radial-gradient(at left top, ${tier.color}, transparent 70%)`
            }} />
          
        </div>
        {/* Border */}
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background: hovered ? tier.color : 'rgba(255,255,255,0.06)',
            WebkitMaskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)',
            maskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)'
          }} />
        

        {/* Gem image */}
        <img
          src={tier.imgSrc}
          alt={tier.name}
          className="pointer-events-none absolute z-[4] h-[88px] w-[88px] object-contain transition-transform duration-500"
          style={{
            left: '-1rem',
            top: '-1.5rem',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))',
            transform: hovered ? 'translateY(-6px) scale(1.1) rotate(-5deg)' : 'none'
          }} />
        

        {/* Content */}
        <div className="relative z-[1] flex h-full flex-col items-start px-6 pb-7 pt-16">
          <span
            className="mb-3 font-heading text-[1.375rem] font-bold uppercase tracking-[0.06em]"
            style={{ color: tier.textColor }}>
            
            {tier.name}
          </span>
          <div
            className="font-heading text-[3rem] font-bold leading-none tracking-[-0.03em] text-white">
            
            {tier.priority}
          </div>
          <span
            className="mb-4 font-heading text-[0.625rem] font-bold uppercase tracking-[0.12em]"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            
            Queue Priority
          </span>
          <div
            className="mb-5 w-full pb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-white">{tier.price}</span>
            </div>
            <div
              className="mt-0.5 flex items-baseline gap-1.5 text-[0.6875rem]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              
              <span>/mo</span>
            </div>
          </div>
          <ul className="mb-6 w-full flex-1 list-none">
            {tier.features.map((f) =>
            <li
              key={f}
              className="relative py-1.5 ps-5 text-[0.8125rem]"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              
                <span
                className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 opacity-60"
                style={{ background: tier.color }} />
              
                {f}
              </li>
            )}
          </ul>
          <a
            href="/shop"
            className="relative block w-full cursor-pointer no-underline">
            
            <div
              className="relative block w-full"
              >
              
              <div
                className="absolute inset-0"
                style={{
                  background: `color-mix(in srgb, ${tier.color} 8%, rgba(22,27,36,0.6))`
                }} />
              
              <div
                className="absolute inset-0 transition-[background,filter] hover:brightness-[1.4]"
                style={{
                  background: tier.color
                }} />
              
              <span className="relative z-[1] flex w-full items-center justify-center px-6 py-3.5 font-heading text-[13px] font-bold uppercase text-white">
                Subscribe / ទិញឥឡូវនេះ
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>);

}

export default function SubscriptionsSection() {
  const [activeTab, setActiveTab] = useState<'allowlist' | 'public'>('allowlist');

  return (
    <>
      {/* Top zigzag */}
      <div className="relative -mb-px w-full leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" className="block h-12 w-full md:h-20">
          <path d="M0 80V52L36 24H320L344 0H536L560 24H880L904 0H1096L1120 24H1404L1440 52V80H0Z" fill="#0C0F14" />
        </svg>
      </div>

      <section
        id="subscriptions"
        className="relative section-py"
        style={{ backgroundColor: '#0C0F14' }}>
        
        <div className="container-wide">
          <div data-reveal className="mb-14 text-center">
            <h2 className="section-title">
              Skip the Queue.
              <br />
              <span className="text-gradient">Play Faster.</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Higher tier = higher priority. Get in the city while others wait.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                aria-pressed={activeTab === 'allowlist'}
                className="cursor-pointer transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none"
                onClick={() => setActiveTab('allowlist')}>
                
                <div
                  className="relative flex items-center justify-center px-5 py-3">
                  
                  <div
                    className="absolute inset-0"
                    style={{
                      background: activeTab === 'allowlist' ? 'rgba(0,56,70,0.5)' : '#161B24'
                    }} />
                  
                  <div
                    className="absolute inset-0"
                    style={{
                      background: activeTab === 'allowlist' ? '#00DCFF' : '#797979'
                    }} />
                  
                  <span className={`relative z-[1] font-heading text-xs font-bold uppercase leading-none tracking-[0.06em] ${activeTab === 'allowlist' ? 'text-black' : 'text-white'}`}>
                    VTB Whitelist
                  </span>
                </div>
              </button>
              <button
                aria-pressed={activeTab === 'public'}
                className="cursor-pointer transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none"
                onClick={() => setActiveTab('public')}>
                
                <div
                  className="relative flex items-center justify-center px-5 py-3">
                  
                  <div
                    className="absolute inset-0"
                    style={{
                      background: activeTab === 'public' ? 'rgba(0,56,70,0.5)' : '#161B24'
                    }} />
                  
                  <div
                    className="absolute inset-0"
                    style={{
                      background: activeTab === 'public' ? '#00DCFF' : '#797979'
                    }} />
                  
                  <span
                    className={`relative z-[1] font-heading text-xs font-bold uppercase leading-none tracking-[0.06em] ${activeTab === 'public' ? 'text-black' : 'text-white/60'}`}>
                    VTB Public Server
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-10 pt-12 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-6 min-[1400px]:gap-4">
            {tiers.map((tier, i) =>
            <div
              key={tier.name}
              data-reveal
              style={{ transitionDelay: `${i * 0.05}s` }}>
              
                <TierCard tier={tier} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom zigzag */}
      <div className="relative -mt-px w-full leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" className="block h-12 w-full md:h-20">
          <path d="M0 0V28L36 56H320L344 80H536L560 56H880L904 80H1096L1120 56H1404L1440 28V0H0Z" fill="#0C0F14" />
        </svg>
      </div>
    </>);

}