import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { renderSiteOgElement } from '@/lib/og-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'VTB ROLEPLAY';
    const description =
      searchParams.get('description') ||
      'The Ultimate GTA V Roleplay Experience — Classic & Respect. / បទពិសោធន៍លេងតួ GTA V ដ៏អស្ចារ្យបំផុត - បុរាណ និងការគោរព។';

    return new ImageResponse(renderSiteOgElement(title, description), {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating site OG image, rendering fallback:', error);
    return new ImageResponse(
      renderSiteOgElement(
        'VTB ROLEPLAY',
        'The Ultimate GTA V Roleplay Experience — Classic & Respect.'
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  }
}
