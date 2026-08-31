import React from 'react';
import { Metadata } from 'next';
import RefcodeOBSClientPlayer from '@/components/refcode/RefcodeOBSClientPlayer';
import { getRefcodeBySlugOrCode } from '@/lib/refcode-data';

export const metadata: Metadata = {
  title: 'Ref Code Lottie Overlay | VTB Roleplay (OBS Overlay)',
  description: '100% transparent looping Lottie animation for streamers & OBS Studio. / ផ្ទាំងថ្លា Lottie សម្រាប់ OBS',
};

interface RefcodeMainPageProps {
  searchParams: Promise<{
    code?: string;
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

export default async function PureRefcodeMainOBSPage({ searchParams }: RefcodeMainPageProps) {
  const sParams = await searchParams;
  const targetCode = sParams?.code || 'Ibunny';
  const item = await getRefcodeBySlugOrCode(targetCode);

  const displayCode = item ? item.code : targetCode;
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
