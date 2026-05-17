"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Users,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  Lock,
  ChevronRight,
  MonitorPlay,
  Share2
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/brand-logo';

// Lazy load heavy 3D canvas
const SanctuaryCanvas = dynamic(() => import('@/components/ui/sanctuary-canvas'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: 'url(/hero-poster.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  ),
});

const PrayerWidget = dynamic(() => import('@/components/ui/prayer-widget'), { ssr: false });
const FundraisingWidget = dynamic(() => import('@/components/ui/fundraising-widget'), { ssr: false });
const FeaturesShowcase = dynamic(() => import('@/components/ui/features-showcase'), { ssr: false });
const AmbientAudio = dynamic(() => import('@/components/ui/ambient-audio'), { ssr: false });

// ─── Word-stagger typing animation ──────────────────────────────────────
function AnimatedHeadline({ text, highlight }: { text: string; highlight: string }) {
  const allWords = (text + ' ' + highlight).split(' ');
  const mainWordCount = text.split(' ').length;

  return (
    <h1 className="text-4xl md:text-5xl lg:text-[58px] font-semibold text-white max-w-2xl mb-6 leading-[1.08] tracking-[-0.03em] font-sans">
      {allWords.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: 0.15 + i * 0.07,
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`inline-block mr-[0.25em] ${i >= mainWordCount ? 'font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#80bea6] via-[#D4AF37] to-white' : ''}`}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

// ─── Shimmer badge ───────────────────────────────────────────────────────
function ShimmerBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#064E3B]/40 text-[#80bea6] rounded-full border border-[#064E3B]/50 mb-7 text-[10px] font-extrabold uppercase tracking-widest shadow-lg overflow-hidden"
    >
      {children}
      {/* shimmer sweep */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_1.2s_forwards]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)',
          animation: 'shimmer 2.5s ease-in-out 1.2s forwards',
        }}
      />
    </motion.div>
  );
}

export default function Home() {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      setScrollY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqItems = [
    {
      q: "How does MasjidPortal integrate with existing TV displays inside the prayer hall?",
      a: "MasjidPortal provides a built-in 'Display Mode' with an optimized custom URL. Simply load this on any smart TV or mini-computer (like a Raspberry Pi or Chromecast) connected to the TV. It auto-updates prayer schedules, iqamah timers, community alerts, and mosque activities in real-time with stunning typography."
    },
    {
      q: "Is the financial data secure and auditable for the committee?",
      a: "Absolutely. All transactions, recurring Waqf pledges, and general contributions map to our audited ledger schema. Built on the InsForge platform using PostgreSQL with row-level security, every donation is instantly accounted for, tax receipts are generated, and committee Admins can download full financial ledger audits instantly."
    },
    {
      q: "Can Imams generate announcements directly to the congregation?",
      a: "Yes. Imams and authorized organizers have access to the Broadcast tool inside the admin layout. Announcements sync instantly to community mobile apps and display boards inside the masjid, keeping the entire congregation united."
    },
    {
      q: "What is the onboarding process for new mosques?",
      a: "Setting up takes less than 15 minutes. Once registered, MasjidPortal automatically calculates local prayer offsets based on your geographical coordinates or JAKIM/local authority schedules, imports existing member lists, and prepares your instant digital Infaq QR codes."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#050a08] text-white overflow-x-hidden selection:bg-[#D4AF37]/35 selection:text-white font-sans scroll-smooth">

      {/* ── GLOBAL AMBIENT LIGHTS ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-8%] w-[520px] h-[520px] bg-[#064E3B]/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-[15%] right-[-12%] w-[640px] h-[640px] bg-[#D4AF37]/4 rounded-full blur-[170px]" />
        <div className="absolute top-[55%] left-[75%] w-[380px] h-[380px] bg-[#80bea6]/4 rounded-full blur-[130px]" />
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#050a08]/80 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl'
        : 'bg-transparent py-6'
        }`}>
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1440px] mx-auto">
          <BrandLogo variant="full" size="md" theme="dark" linked />
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#about" className="text-white/60 hover:text-white transition-all text-xs uppercase tracking-widest font-semibold">About</a>
            <a href="#features" className="text-white/60 hover:text-white transition-all text-xs uppercase tracking-widest font-semibold">Modules</a>
            <a href="#live-sync" className="text-white/60 hover:text-white transition-all text-xs uppercase tracking-widest font-semibold">Sanctuary Sync</a>
            <a href="#faq" className="text-white/60 hover:text-white transition-all text-xs uppercase tracking-widest font-semibold">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
              Sign In
            </Link>
            <Link
              href="/login"
              className="relative group bg-[#064E3B] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-[#095f49] hover:scale-[1.03] active:scale-95 shadow-[0_4px_25px_rgba(6,78,59,0.25)] border border-[#80bea6]/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1">
                Launch Portal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 pointer-events-none" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION: CINEMATIC FULL-BLEED ───────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        id="hero"
      >
        {/* ── 3D Canvas fills entire hero ── */}
        <div className="absolute inset-0 z-0">
          <SanctuaryCanvas activeSection={activeTabIdx} scrollY={scrollY} />

          {/* Left vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a08]/85 via-[#050a08]/50 to-transparent pointer-events-none" />

          {/* Bottom fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050a08] to-transparent pointer-events-none" />

          {/* Top vignette */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050a08]/40 to-transparent pointer-events-none" />
        </div>

        {/* ── Content overlay ── */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-28 pb-28 md:pt-36 md:pb-36">
          <div className="max-w-2xl">

            {/* Shimmer badge */}
            <ShimmerBadge>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse flex-shrink-0" />
              <span>The Architectural Grace of Spiritual Operations</span>
            </ShimmerBadge>

            {/* Animated headline */}
            <AnimatedHeadline
              text="The Digital Sanctuary for"
              highlight="Modern Mosques."
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base lg:text-[17px] text-white/65 max-w-xl mb-10 leading-relaxed font-light"
            >
              Experience precision management engineered from the ground up to empower mosque committees, Imams, and community leaders with unprecedented administrative clarity and technological grace.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 w-full md:w-auto"
            >
              <Link
                href="/login"
                className="bg-[#064E3B] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#064E3B]/30 hover:bg-[#0a614a] duration-300 hover:scale-[1.04] active:scale-95 transition-all flex items-center gap-1.5 border border-[#80bea6]/30"
              >
                Launch Sanctuary <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById('live-sync');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 duration-300 hover:scale-[1.04] transition-all backdrop-blur-sm"
              >
                Analyze Dynamics
              </button>
            </motion.div>

            {/* Micro stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.35 }}
              className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/8 w-full max-w-lg"
            >
              <div>
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Islamic Venues</span>
                <span className="text-xl font-extrabold text-white mt-1 block">500+</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Electronic Infaq</span>
                <span className="text-xl font-extrabold text-[#D4AF37] mt-1 block">RM 1.2M+</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Active Jemaah</span>
                <span className="text-xl font-extrabold text-white mt-1 block">45,000+</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Interactive hint ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/8 flex items-center gap-2 text-[9px] font-bold text-white/45 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>3D INTERACTIVE · MOVE MOUSE TO EXPLORE</span>
          </div>
          {/* Scroll caret */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full mt-1 animate-bounce" />
        </motion.div>
      </section>

      {/* ── REMAINING SECTIONS ────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">

        {/* ── SECTION 2: LIVE METRIC SYNCS ─────────────────────────────── */}
        <section id="live-sync" className="relative mb-28 md:mb-36 pt-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">Unification of Community Flow</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-3">Solat Timers & Transparent Ledger</h2>
            <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
              Experience dynamic, multi-zone prayer notifications linked to local astronomical records together with live infaq metrics rendered in true elegance.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <PrayerWidget />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-between">
              <FundraisingWidget />
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PRODUCT STORYTELLING ─────────────────────────── */}
        <section id="features" className="relative mb-28 md:mb-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#80bea6] uppercase block mb-1">Architectural Layout Modules</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Full-Spectrum Core Operations</h2>
            </div>
            <p className="text-white/50 text-xs font-light max-w-sm leading-relaxed">
              Every detail is engineered with absolute mathematical grace and optimized for direct committee execution. Touch tabs to preview actual screens.
            </p>
          </div>
          <FeaturesShowcase onTabChange={(idx) => setActiveTabIdx(idx)} />
        </section>

        {/* ── SECTION 4: TRUST & SECURITY ─────────────────────────────── */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-between mb-28 md:mb-36 bg-gradient-to-br from-[#064E3B]/10 to-transparent border border-white/5 p-8 md:p-14 rounded-[32px] overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="lg:col-span-7 z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">SACRED TRUST METRIC</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">Crafted for Trust. Hardened and Audited.</h2>
            <p className="text-white/70 text-xs md:text-sm font-light leading-relaxed mb-8 max-w-xl">
              We understand that managing spiritual funds and congregational trust is a sacred duty. That is why MasjidPortal runs on robust PostgreSQL database instances with automatic database snapshots, zero external trackers, and full data sovereignty for your mosque.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 text-[#80bea6]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">End-to-End Payout Security</h4>
                  <p className="text-[10.5px] text-white/50 mt-1 leading-relaxed">Secure payment pathways with automatic direct deposits and clear ledger receipts.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Congregational Privacy First</h4>
                  <p className="text-[10.5px] text-white/50 mt-1 leading-relaxed">We never sell, analyze, or process your community data for marketing purposes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center z-10">
            <div className="bg-[#050a08]/40 border border-white/10 rounded-2xl p-6 text-center shadow-xl w-full max-w-xs relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#064E3B]/20 blur-xl rounded-full" />
              <div className="w-12 h-12 bg-[#064E3B] text-[#80bea6] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#80bea6]/20">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Islamic Fintech Certified</h4>
              <p className="text-[10px] text-white/40 mt-1 mb-5">Valid transaction routes and instant reconciliation audits.</p>
              <div className="h-[0.5px] bg-white/10 w-full mb-4" />
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-semibold block">SSL SECURED CONNECT</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: FAQ ────────────────────────────────────────────── */}
        <section id="faq" className="relative mb-28 md:mb-36 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">Clarifying Operations</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-3">Frequently Asked Queries</h2>
            <p className="text-white/50 text-xs md:text-sm font-light">Everything you need to know to launch the sanctuary platform in your mosque.</p>
          </div>
          <div className="space-y-3.5">
            {faqItems.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className="font-semibold text-sm md:text-base text-white/90">{item.q}</span>
                    <span className={`p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/55 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#D4AF37] border-[#D4AF37]/50' : ''}`}>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 border-t border-white/5 text-xs md:text-sm text-white/60 leading-relaxed font-light">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 6: CTA ───────────────────────────────────────────── */}
        <section className="relative text-center mb-28 md:mb-36 p-12 md:p-20 bg-gradient-to-t from-[#021f18] to-transparent border border-[#064E3B]/20 rounded-[36px] overflow-hidden max-w-5xl mx-auto">
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[300px] bg-[#064E3B]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">ELEVATE YOUR JEMAAH EXPERIENCE</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Digitize Your Sanctuary Today</h2>
          <p className="text-white/60 text-xs md:text-sm font-light mb-10 max-w-lg mx-auto leading-relaxed">
            Join hundreds of committee Imams and local administrators who leverage MasjidPortal to manage their sanctuaries with utmost technical grace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="bg-[#064E3B] text-white px-9 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl shadow-[#064E3B]/20 hover:scale-[1.03] hover:bg-[#0a6049] transition-all flex items-center gap-1.5 border border-[#80bea6]/30"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="bg-transparent text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/5 px-9 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.03] transition-all flex items-center gap-1.5">
              Contact Organizing Expert
            </button>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="relative bg-[#020504] border-t border-white/5 z-10 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-[80%] right-[30%] w-[400px] h-[150px] bg-[#064E3B]/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-12 max-w-[1440px] mx-auto mb-16">
          <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
            <BrandLogo variant="full" size="md" theme="dark" />
            <p className="text-white/45 text-xs max-w-xs leading-relaxed mt-2 font-light">
              Elevating mosque administrative integrity through premium engineering. Empowering congregations, organizing Imams, and verifying donations with ultimate grace.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">STAKEHOLDERS</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Mosque Committees</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Mosque Imams</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Community Organizers</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Congregation Members</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">RESOURCES & LEGAL</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Privacy Sanctuary Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Terms of Theological Agreement</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Platform Security Status</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#80bea6] text-xs font-light transition-all">Technical Service Level</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 mx-6 md:mx-12 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light">
          <span className="text-white/35">
            © {new Date().getFullYear()} MasjidPortal. Standardized by the InsForge Network and JAKIM guidelines.
          </span>
          <div className="flex gap-4">
            <a href="#" className="text-white/35 hover:text-white transition-all"><MonitorPlay className="w-4 h-4" /></a>
            <a href="#" className="text-white/35 hover:text-white transition-all"><Share2 className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>

      {/* ── AMBIENT AUDIO TOGGLE ──────────────────────────────────────────── */}
      <AmbientAudio />

      {/* ── GLOBAL KEYFRAMES ─────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
