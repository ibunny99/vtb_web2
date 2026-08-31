import React from 'react';

export default function RefcodeOBSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
      className="min-h-screen w-screen h-screen flex items-center justify-center bg-transparent"
    >
      {children}
    </div>
  );
}
