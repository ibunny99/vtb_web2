import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Server Rules / ច្បាប់ម៉ាស៊ីនមេ',
  description:
    'Official rules and regulations of VTB Roleplay server to ensure fair, authentic, and respectful roleplay. / បទបញ្ជា និងច្បាប់ផ្លូវការនៃម៉ាស៊ីនមេ VTB Roleplay។',
  openGraph: {
    title: 'Server Rules | VTB Roleplay',
    description:
      'Official rules and regulations of VTB Roleplay server to ensure fair, authentic, and respectful roleplay.',
    url: '/rules',
    siteName: 'VTB Roleplay',
    images: [
      {
        url: '/api/og?title=SERVER%20RULES&description=Official%20Rules%20and%20Regulations%20for%20VTB%20Roleplay',
        width: 1200,
        height: 630,
        alt: 'Server Rules - VTB Roleplay',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Server Rules | VTB Roleplay',
    description:
      'Official rules and regulations of VTB Roleplay server to ensure fair, authentic, and respectful roleplay.',
    images: [
      '/api/og?title=SERVER%20RULES&description=Official%20Rules%20and%20Regulations%20for%20VTB%20Roleplay',
    ],
  },
};

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
