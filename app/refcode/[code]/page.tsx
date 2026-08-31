import React from 'react';
import { Metadata } from 'next';
import RefcodeOBSClientPlayer from '@/components/refcode/RefcodeOBSClientPlayer';
import { getRefcodeBySlugOrCode } from '@/lib/refcode-data';

interface RefcodePageProps {
  params: Promise<{
    code: string;
  }>;
  searchParams?: Promise<{
    title?: string;
    color?: string;
    boxColor?: string;
    textColor?: string;
    codeColor?: string;
    titleColor?: string;
    font?: string;
    codeFont?: string;
    titleFont?: string;
  }>;
}

export async function generateMetadata({ params }: RefcodePageProps): Promise<Metadata> {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const item = await getRefcodeBySlugOrCode(decodedCode);

  const displayCode = item ? item.code : decodedCode;
  const title = `Ref Code: ${displayCode} (OBS Overlay) | VTB Roleplay`;
  const description = `Referral Code ${displayCode} transparent overlay for OBS. / ផ្ទាំងថ្លាសម្រាប់ OBS`;

  return {
    title,
    description,
  };
}

export default async function PureRefcodeOBSPage({ params, searchParams }: RefcodePageProps) {
  const { code } = await params;
  const sParams = searchParams ? await searchParams : {};
  const decodedCode = decodeURIComponent(code);
  const item = await getRefcodeBySlugOrCode(decodedCode);

  const displayCode = item ? item.code : decodedCode;
  const displayTitle = sParams?.title || item?.title || 'REFCODE';
  const boxColor = sParams?.boxColor || sParams?.color || item?.boxColor || '#00DCFF';
  const textColor = sParams?.textColor || sParams?.codeColor || item?.textColor || '#000000';
  const titleColor = sParams?.titleColor || item?.titleColor || '#FFFFFF';
  const codeFont = sParams?.codeFont || sParams?.font || item?.codeFont || '1FTV VIP Sakana';
  const titleFont = sParams?.titleFont || item?.titleFont || '1FTV VIP Sakana';

  return (
    <RefcodeOBSClientPlayer
      initialCode={displayCode}
      initialTitle={displayTitle}
      boxColor={boxColor}
      textColor={textColor}
      titleColor={titleColor}
      codeFont={codeFont}
      titleFont={titleFont}
    />
  );
}
