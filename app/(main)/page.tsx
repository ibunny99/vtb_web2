import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import StatsSection from '@/components/StatsSection';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
  description:
    'VTB RP starts with you. A world built from the ground up with custom roleplay hubs, authentic civilian life, and next-level experiences. / VTB RP ចាប់ផ្តើមពីអ្នក។ ពិភពលោកដែលបង្កើតឡើងវិញពីដំបូងសម្រាប់ការលេងតួដ៏អស្ចារ្យបំផុត។',
  openGraph: {
    title: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
    description:
      'VTB RP starts with you. A world built from the ground up with custom roleplay hubs, authentic civilian life, and next-level experiences. / VTB RP ចាប់ផ្តើមពីអ្នក។ ពិភពលោកដែលបង្កើតឡើងវិញពីដំបូងសម្រាប់ការលេងតួដ៏អស្ចារ្យបំផុត។',
    url: '/',
    siteName: 'VTB Roleplay',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'VTB Roleplay - The Ultimate GTA V Roleplay Server',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
    description:
      'VTB RP starts with you. A world built from the ground up with custom roleplay hubs, authentic civilian life, and next-level experiences. / VTB RP ចាប់ផ្តើមពីអ្នក។ ពិភពលោកដែលបង្កើតឡើងវិញពីដំបូងសម្រាប់ការលេងតួដ៏អស្ចារ្យបំផុត។',
    images: ['/api/og'],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <FAQSection />
    </>
  );
}
