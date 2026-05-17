"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroOverlay from '@/components/v3/HeroOverlay';
import Head from 'next/head';

// Lazy load the 3D scene so that Next.js doesn't SSR WebGL components
const CanvasScene = dynamic(() => import('@/components/v3/CanvasScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020406]" />
});

export default function HomeV3() {
  return (
    <>
      <Head>
        <title>Masjid Portal | Sacred Intelligence</title>
        <meta name="description" content="The Digital Operating System for Modern Islamic Communities." />
      </Head>

      <div className="relative min-h-screen bg-[#020406] text-white overflow-hidden font-sans selection:bg-[#D4AF37]/35">
        {/* Fullscreen 3D WebGL Canvas Layer */}
        <div className="fixed inset-0 z-0 pointer-events-auto">
          <Suspense fallback={<div className="w-full h-full bg-[#020406]" />}>
            <CanvasScene />
          </Suspense>
        </div>

        {/* Cinematic Scroll Overlay Layer */}
        <div className="relative z-10 flex flex-col pointer-events-none w-full">
          <HeroOverlay />
        </div>

        {/* Global Keyframes for minor utilities */}
        <style jsx global>{`
          /* Smooth scrolling applied application-wide */
          html {
            scroll-behavior: smooth;
          }
          /* Custom scrollbar to match the cinematic vibe */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #000;
          }
          ::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </div>
    </>
  );
}
