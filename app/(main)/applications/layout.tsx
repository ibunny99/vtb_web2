import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Applications & Whitelist / ការចុះឈ្មោះ',
  description:
    'Whitelist application portal and citizenship registration for VTB Roleplay. Join the ultimate GTA V roleplay experience. / ដាក់ពាក្យ Whitelist ចូលរួម VTB Roleplay។',
  openGraph: {
    title: 'Applications & Whitelist | VTB Roleplay',
    description:
      'Whitelist application portal and citizenship registration for VTB Roleplay. Join the ultimate GTA V roleplay experience.',
    url: '/applications',
    siteName: 'VTB Roleplay',
    images: [
      {
        url: '/api/og?title=APPLICATIONS%20%26%20WHITELIST&description=Whitelist%20Application%20Portal%20for%20VTB%20Roleplay',
        width: 1200,
        height: 630,
        alt: 'Apply to join VTB Roleplay',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applications & Whitelist | VTB Roleplay',
    description:
      'Whitelist application portal and citizenship registration for VTB Roleplay. Join the ultimate GTA V roleplay experience.',
    images: [
      '/api/og?title=APPLICATIONS%20%26%20WHITELIST&description=Whitelist%20Application%20Portal%20for%20VTB%20Roleplay',
    ],
  },
};

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
