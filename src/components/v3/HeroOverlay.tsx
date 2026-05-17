"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Globe, Lock, Code } from 'lucide-react';
import { BrandLogo } from '@/components/ui/brand-logo';

export default function HeroOverlay() {
    const { scrollYProgress } = useScroll();
    const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

    const features = [
        { icon: Globe, title: "Global Sync", desc: "Instantly broadcast to all screens, synced strictly to JAKIM schedules." },
        { icon: Lock, title: "Sacred Ledger", desc: "Bank-grade encrypted donations. Every cent mapped." },
        { icon: Code, title: "API Driven", desc: "Headless content management system for modern Mosques." }
    ];

    return (
        <div className="absolute inset-0 pointer-events-none">

            <header className="fixed top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center pointer-events-auto mix-blend-screen">
                <BrandLogo variant="icon" size="lg" theme="dark" linked />
                <Link href="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold px-6 py-2.5 rounded-full border border-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    Access Terminal
                </Link>
            </header>

            <motion.div
                style={{ opacity: titleOpacity, y: titleY }}
                className="h-[100svh] flex flex-col justify-center items-center text-center px-6 pt-20"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-5xl flex flex-col items-center"
                >
                    <div className="mb-6 inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-5 py-1.5 rounded-full text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        Masjid Portal V3
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black text-white tracking-tighter leading-[0.85] mb-8 mix-blend-screen drop-shadow-2xl">
                        SACRED<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#80bea6] via-[#D4AF37] to-white">
                            INTELLIGENCE
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-white max-w-2xl mx-auto font-light tracking-widest mb-12 uppercase leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                        The Digital Operating System for Modern Islamic Communities. <br className="hidden md:block" />
                        Engineered with Unprecedented Grace.
                    </p>

                    <div className="flex justify-center gap-6 pointer-events-auto">
                        <Link
                            href="/login"
                            className="group relative overflow-hidden bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_30px_rgba(255,255,255,0.3)] hover:shadow-[0_4px_50px_rgba(255,255,255,0.6)] hover:scale-[1.02] transition-all flex items-center gap-3"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                            <span className="relative z-10">Deploy Sanctuary</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Force page scroll to allow scroll-driven narrative */}
            <div className="h-[200vh] pointer-events-none"></div>

            <div className="fixed bottom-0 w-full p-6 md:p-12 bg-gradient-to-t from-[#020406] via-[#020406]/90 to-transparent flex justify-center pointer-events-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                        >
                            <feat.icon className="w-8 h-8 text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                            <h3 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-3">{feat.title}</h3>
                            <p className="text-white/50 text-xs font-light leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
