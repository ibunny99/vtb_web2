'use client';
import React from 'react';

interface ScriptItem {
  name: string;
  category: string;
  price: string;
  imgSrc: string;
  alt: string;
}

const scripts: ScriptItem[] = [
{
  name: 'Racing',
  category: 'Criminal',
  price: '$59.99',
  imgSrc: 'https://studio.prodigyrp.net/api/media/file/Racing-768x576.webp',
  alt: 'Racing script preview showing street racing in FiveM'
},
{
  name: 'Boosting',
  category: 'Criminal',
  price: '$59.99',
  imgSrc: 'https://studio.prodigyrp.net/api/media/file/boosting-768x576.webp',
  alt: 'Boosting script preview showing car theft mechanics in FiveM'
},
{
  name: 'Boxing',
  category: 'Civilian',
  price: '$39.99',
  imgSrc: 'https://studio.prodigyrp.net/api/media/file/boxing-768x576.webp',
  alt: 'Boxing script preview showing fighting mechanics in FiveM'
},
{
  name: 'Minigames',
  category: 'Utility',
  price: '$24.99',
  imgSrc: 'https://studio.prodigyrp.net/api/media/file/Minigames-768x576.webp',
  alt: 'Minigames script preview showing various mini-game activities in FiveM'
}];


function ScriptCard({ script }: {script: ScriptItem;}) {
  return (
    <div data-reveal>
      <a
        href="https://studio.prodigyrp.net"
        target="_blank"
        rel="noreferrer"
        className="group block no-underline transition-transform duration-300 ease-out hover:-translate-y-1">
        
        <div
          className="relative block w-full"
>
          
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{ background: '#161B24' }} />
          
          {/* Border */}
          <div
            className="absolute inset-0 transition-colors duration-300 group-hover:opacity-100"
            style={{
              background: 'rgba(255,255,255,0.06)',
              WebkitMaskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)',
              maskImage: 'linear-gradient(135deg, white 0%, white 40%, transparent 100%)'
            }} />
          
          {/* Content */}
          <div className="relative z-[1] flex flex-col overflow-hidden">
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={script.imgSrc}
                alt={script.alt}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              
            </div>
            <div className="px-6 py-5">
              <span
                className="mb-1 block font-heading text-[0.5625rem] font-bold uppercase tracking-[0.1em]"
                style={{ color: '#00DCFF' }}>
                
                {script.category}
              </span>
              <h3 className="mb-2 font-heading text-2xl font-bold uppercase tracking-[0.02em] text-white">
                {script.name}
              </h3>
              <span
                className="font-heading text-base font-bold"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                
                {script.price}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>);

}

export default function StoreSection() {
  return (
    <section id="store" className="relative section-py">
      <div className="container-wide">
        <div data-reveal className="mb-12 text-center">
          <h2 className="section-title">
            Script Store.{' '}
            <span className="text-gradient">By Rep Team.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Premium FiveM scripts crafted by the Rep Team - the same tools that power our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scripts.map((script, i) =>
          <div key={script.name} style={{ transitionDelay: `${i * 0.1}s` }}>
              <ScriptCard script={script} />
            </div>
          )}
        </div>

        <div data-reveal className="mt-10 flex justify-center">
          <a href="https://studio.prodigyrp.net" target="_blank" rel="noreferrer">
            <div
              className="inline-flex relative cursor-pointer items-center justify-center font-heading font-extrabold uppercase whitespace-nowrap text-black no-underline active:scale-[0.97] transition-transform duration-150 px-8 py-4 text-sm">
              
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  background: '#00DCFF'
                }} />
              
              <span className="relative z-10 inline-flex flex-row items-center gap-1.5 whitespace-nowrap text-black">
                Check Out Our Store
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>);

}