import { ImageResponse } from 'next/og';
import { renderSiteOgElement } from '@/lib/og-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'VTB Roleplay - The Ultimate GTA V Roleplay Server';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    renderSiteOgElement(
      'VTB ROLEPLAY',
      'The Ultimate GTA V Roleplay Experience — Classic & Respect. / បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត - បុរាណ និងការគោរព។'
    ),
    {
      ...size,
    }
  );
}
