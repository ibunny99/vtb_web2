import React from 'react';
import type { Metadata, Viewport } from 'next';
import '@/styles/index.css';
import '@/styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://vtbrp.net';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
    template: '%s | VTB Roleplay',
  },
  description:
    'VTB Roleplay Server - Experience the pinnacle of GTA V roleplay: Classic, Respectful, and Immersive. / ម៉ាស៊ីនមេ VTB Roleplay - បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត។',
  keywords: [
    'VTB Roleplay',
    'VTB RP',
    'GTA V RP',
    'GTA 5 Roleplay Cambodia',
    'FiveM Cambodia',
    'VTB Roleplay Server',
  ],
  authors: [{ name: 'VTB Roleplay' }],
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }, { url: '/v1b-logo.png', type: 'image/png' }],
    apple: [{ url: '/v1b-logo.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'VTB Roleplay',
    title: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
    description:
      'VTB Roleplay Server - Experience the pinnacle of GTA V roleplay: Classic, Respectful, and Immersive. / ម៉ាស៊ីនមេ VTB Roleplay - បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត។',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'VTB Roleplay - The Ultimate GTA V Roleplay Server',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VTB Roleplay | The Ultimate GTA V Roleplay Server',
    description:
      'VTB Roleplay Server - Experience the pinnacle of GTA V roleplay: Classic, Respectful, and Immersive. / ម៉ាស៊ីនមេ VTB Roleplay - បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត។',
    images: ['/api/og'],
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FB_APP_ID || process.env.FB_APP_ID || '966242223397117',
  },
  other: {
    'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID || process.env.FB_APP_ID || '966242223397117',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,900&family=Readex+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fprodigyrp5222back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body>
        {children}
      </body>
    </html>
  );
}
