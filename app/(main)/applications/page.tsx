'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import bgmain from '@/assets/bg-comming2.png';
import logoh from '@/assets/H-logo1.webm';
import Image from 'next/image';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ApplicationsPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 7,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });
  const [statusMsg, setStatusMsg] = useState(
    'Hệ thống duyệt hồ sơ Whitelist và nhận đơn gia nhập Horizon RP đang hoàn thiện những bước cuối cùng. Đếm ngược thời gian mở cổng đăng ký chính thức:'
  );

  useEffect(() => {
    let target = new Date();
    target.setDate(target.getDate() + 7);

    // Fetch dynamic target date from API
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data && d.data.applications) {
          if (d.data.applications.targetDate) {
            target = new Date(d.data.applications.targetDate);
          }
          if (d.data.applications.statusMessage) {
            setStatusMsg(d.data.applications.statusMessage);
          }
        }
      })
      .catch(() => {});

    const calculateTimeLeft = () => {
      const difference = +target - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <>
      <div className="relative min-h-[calc(100vh-92px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Background Ambient Glow & Grid Patterns */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
            style={{ background: '#00DCFF' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,220,255,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Status Badge */}
          <div className="mt-[8vh] inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[rgba(0,220,255,0.3)] bg-[rgba(0,220,255,0.06)] mb-8 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00DCFF] animate-ping" />
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#00DCFF]">
              Coming Soon • មកដល់ឆាប់ៗនេះ
            </span>
          </div>

          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-228 h-232 object-cover mb-6 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"
          >
            <source src={logoh} type="video/webm" />
          </video>

          <p className="max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed mb-12">
            {statusMsg}
          </p>

          {/* Countdown Timer (dd:hh:mm:ss) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl mb-14">
            {/* Days */}
            <div className="relative bg-[#161B24]/90 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group hover:border-[rgba(0,220,255,0.4)] transition-colors">
              <div className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight group-hover:text-[#00DCFF] transition-colors">
                {/* {formatNumber(timeLeft.days)} */}
                ??
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mt-2">
                Days / ថ្ងៃ
              </span>
            </div>

            {/* Hours */}
            <div className="relative bg-[#161B24]/90 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group hover:border-[rgba(0,220,255,0.4)] transition-colors">
              <div className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight group-hover:text-[#00DCFF] transition-colors">
                {/* {formatNumber(timeLeft.hours)} */}
                ??
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mt-2">
                Hours / ម៉ោង
              </span>
            </div>

            {/* Minutes */}
            <div className="relative bg-[#161B24]/90 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group hover:border-[rgba(0,220,255,0.4)] transition-colors">
              <div className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight group-hover:text-[#00DCFF] transition-colors">
                {/* {formatNumber(timeLeft.minutes)} */}
                ??
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mt-2">
                Minutes / នាទី
              </span>
            </div>

            {/* Seconds */}
            <div className="relative bg-[#161B24]/90 border border-[#00DCFF]/40 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl group">
              <div className="font-heading text-4xl sm:text-6xl font-extrabold text-[#00DCFF] tracking-tight">
                {/* {formatNumber(timeLeft.seconds)} */}
                ??
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#00DCFF]/60 mt-2">
                Seconds / វិនាទី
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/bxkdvMprMN"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#00DCFF] hover:bg-[#52F0FF] text-black font-heading font-extrabold text-xs uppercase rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(0,220,255,0.3)]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 -28.5 256 256">
                <path d="M216.856,16.597C200.285,8.843 182.566,3.208 164.042,0C161.767,4.113 159.109,9.645 157.276,14.046C137.584,11.085 118.073,11.085 98.743,14.046C96.911,9.645 94.193,4.113 91.897,0C73.353,3.208 55.613,8.864 39.042,16.638C5.618,67.147 -3.443,116.401 1.087,164.956C23.256,181.511 44.74,191.568 65.862,198.149C71.077,190.971 75.728,183.341 79.735,175.3C72.104,172.401 64.795,168.822 57.889,164.668C59.721,163.311 61.513,161.891 63.245,160.431C105.367,180.133 151.135,180.133 192.755,160.431C194.506,161.891 196.298,163.311 198.11,164.668C191.184,168.843 183.855,172.421 176.224,175.321C180.23,183.341 184.862,190.992 190.097,198.169C211.239,191.588 232.743,181.532 254.912,164.956C260.228,108.668 245.831,59.866 216.856,16.597ZM85.474,135.095C72.829,135.095 62.459,123.29 62.459,108.915C62.459,94.54 72.608,82.715 85.474,82.715C98.341,82.715 108.71,94.519 108.489,108.915C108.509,123.29 98.341,135.095 85.474,135.095ZM170.525,135.095C157.88,135.095 147.511,123.29 147.511,108.915C147.511,94.54 157.659,82.715 170.525,82.715C183.392,82.715 193.761,94.519 193.54,108.915C193.54,123.29 183.392,135.095 170.525,135.095Z" />
              </svg>
              Join Discord / ចូលរួម
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs uppercase rounded-xl transition-colors border border-white/10"
            >
              Back to Home / ទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-1">
        <Image src={bgmain} alt="Background" className="w-full h-auto" />
      </div>
    </>
  );
}
