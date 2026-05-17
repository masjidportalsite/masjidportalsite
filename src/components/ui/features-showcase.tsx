"use client";

import React, { useState } from 'react';
import {
    BarChart3,
    Users2,
    Coins,
    CalendarDays,
    Smartphone,
    HeartHandshake,
    CalendarRange,
    ArrowRight,
    Database,
    QrCode
} from 'lucide-react';

interface Tab {
    id: string;
    name: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    pill: string;
    preview: React.ReactNode;
}

interface FeaturesShowcaseProps {
    onTabChange?: (index: number) => void;
}

export default function FeaturesShowcase({ onTabChange }: FeaturesShowcaseProps) {
    const [activeTab, setActiveTab] = useState<string>('sanctuary');

    const handleTabSelect = (id: string, index: number) => {
        setActiveTab(id);
        if (onTabChange) {
            onTabChange(index);
        }
    };

    const tabs: Tab[] = [
        {
            id: 'sanctuary',
            name: 'Sanctuary Hub',
            icon: <BarChart3 className="w-4 h-4" />,
            title: 'Operational Heartbeat in One Panopticon',
            description: 'Your masjid heartbeat rendered with cinematic clarity. Track congregational growth, pending venue bookings, digital infaq campaigns, and active event metrics within a premium glass-morphic responsive control deck.',
            pill: 'Integrated Systems',
            preview: (
                <div className="w-full h-full flex flex-col justify-between p-7 bg-[#022c22]/40 rounded-2xl border border-white/5 relative overflow-hidden">
                    {/* Subtle grid lines background */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-white" />
                        ))}
                    </div>

                    <div className="flex justify-between items-center z-10">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">Sanctuary Command Center</span>
                            <h4 className="text-lg font-bold text-white mt-1">Operational Metrics Ledger</h4>
                        </div>
                        <span className="text-[11px] font-semibold text-[#80bea6] bg-[#064E3B]/40 px-2.5 py-1 rounded-lg border border-[#064E3B]/60">
                            Live Sync Active
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4.5 my-5 z-10">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/10">
                            <span className="text-[10px] text-white/40 uppercase font-semibold">Infaq Collection</span>
                            <div className="text-xl font-extrabold text-white mt-1">RM 24,850</div>
                            <span className="text-[9px] text-[#80bea6] block mt-1">+12% vs last Friday</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/10">
                            <span className="text-[10px] text-white/40 uppercase font-semibold">Active Jemaah</span>
                            <div className="text-xl font-extrabold text-white mt-1">1,248</div>
                            <span className="text-[9px] text-[#D4AF37] block mt-1">+85 registrations this wk</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/10">
                            <span className="text-[10px] text-white/40 uppercase font-semibold">Booking Requests</span>
                            <div className="text-xl font-extrabold text-white mt-1">4 Pending</div>
                            <span className="text-[9px] text-white/40 block mt-1">Hall A, Classroom 2</span>
                        </div>
                    </div>

                    {/* Simulated chart */}
                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl z-10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Weekly Attendance Flow</span>
                            <span className="text-[9px] text-white/30">Friday Prayers (Solat Jumaat)</span>
                        </div>
                        <div className="flex items-end justify-between h-14 pt-2">
                            <div className="w-[12%] bg-white/10 rounded-t h-[30%]" />
                            <div className="w-[12%] bg-white/10 rounded-t h-[45%]" />
                            <div className="w-[12%] bg-white/10 rounded-t h-[35%]" />
                            <div className="w-[12%] bg-[#064E3B] rounded-t h-[60%]" />
                            <div className="w-[12%] bg-[#064E3B] rounded-t h-[50%]" />
                            <div className="w-[12%] bg-gradient-to-t from-[#80bea6] to-[#D4AF37] rounded-t h-[95%]" />
                            <div className="w-[12%] bg-white/10 rounded-t h-[20%]" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'jemaah',
            name: 'Congregation Center',
            icon: <Users2 className="w-4 h-4" />,
            title: 'Dignified Congregation Network Mapping',
            description: 'Strengthen core community ties by structuring congregation data beautifully. Sort and segment by family profiles, track active program attendance, and configure digital announcements directly to members mobile feeds.',
            pill: 'Congregation CRM',
            preview: (
                <div className="w-full h-full flex flex-col justify-between p-7 bg-[#022c22]/40 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">JEMAAD DATABASE INTEGRITY</span>
                            <h4 className="text-lg font-bold text-white mt-1">Congregation List &amp; Profiles</h4>
                        </div>
                        <Database className="w-5 h-5 text-[#80bea6]" />
                    </div>

                    <div className="space-y-2.5 my-5">
                        <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#80bea6] to-[#064E3B] rounded-full flex items-center justify-center font-bold text-white text-[11px]">
                                    KM
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-white block">Kamal Mustapha</span>
                                    <span className="text-[9px] text-[#80bea6] font-bold block mt-0.5">Family Head • 5 Dependents</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-semibold text-[#80bea6] bg-[#064E3B]/30 border border-[#064E3B]/50 px-2 py-0.5 rounded-full uppercase">
                                Active Member
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#fed65b] to-[#735c00] rounded-full flex items-center justify-center font-bold text-white text-[11px]">
                                    FA
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-white block">Fatimah Al-Zahra</span>
                                    <span className="text-[9px] text-white/40 block mt-0.5">Single • Quran Circle Lead</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-semibold text-[#80bea6] bg-[#064E3B]/30 border border-[#064E3B]/50 px-2 py-0.5 rounded-full uppercase">
                                Staff
                            </span>
                        </div>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                            <span>Broadcast mobile notifications to all lead contacts.</span>
                        </div>
                        <button className="text-[10px] font-bold bg-[#D4AF37]/25 text-[#D4AF37] px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/40 hover:bg-[#D4AF37]/45 tracking-wide uppercase transition-all">
                            Compose Alert
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 'infaq',
            name: 'Electronic Waqf',
            icon: <Coins className="w-4 h-4" />,
            title: 'Impeccable Financial Trust & Transparency',
            description: 'Engage mosque donors with crystal clear audit lines and electronic receipts. Enable frictionless one-touch Infaq, recurring Waqf targets, and instant Zakat calculating scripts for your congregants.',
            pill: 'Sacred Ledger',
            preview: (
                <div className="w-full h-full flex flex-col justify-between p-7 bg-[#022c22]/40 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">TRANSPARENT FINANCIAL TRUST</span>
                            <h4 className="text-lg font-bold text-white mt-1">Smart Electronic Waqf Hub</h4>
                        </div>
                        <QrCode className="w-5 h-5 text-[#D4AF37]" />
                    </div>

                    <div className="bg-[#064E3B]/20 border border-[#064E3B]/30 rounded-xl p-4.5 my-4.5 text-center">
                        <span className="text-[10px] text-white/50 tracking-widest uppercase block mb-1">Instant QR Code Waqf Sync</span>
                        <div className="w-20 h-20 bg-white p-1 rounded-lg mx-auto flex items-center justify-center my-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10">
                            {/* Simplified mock QR code */}
                            <div className="w-full h-full border border-black grid grid-cols-4 grid-rows-4 p-1">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className={`m-[1px] ${i % 3 === 0 || i === 0 || i === 15 ? 'bg-black' : 'bg-transparent'}`} />
                                ))}
                            </div>
                        </div>
                        <span className="text-[10px] text-[#80bea6] font-semibold block uppercase">Scan to Infaq from anywhere</span>
                    </div>

                    <div className="flex justify-between gap-3 text-xs w-full">
                        <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex-1 flex items-center justify-center gap-1.5 hover:bg-white/10 cursor-pointer">
                            <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="text-white font-medium text-[11px]">Dynamic Zakat Calc</span>
                        </div>
                        <div className="bg-[#064E3B]/30 border border-[#064E3B]/50 p-3 rounded-xl flex-1 flex items-center justify-center gap-1.5 hover:bg-[#064E3B]/40 cursor-pointer">
                            <span className="text-white font-bold text-[11px]">Audit Report PDF</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'classes',
            name: 'Educational Hub',
            icon: <CalendarDays className="w-4 h-4" />,
            title: 'Vibrant Islamic Education & Spaces',
            description: 'Host, register, and coordinate theological modules, youth Arabic sessions, and community facility bookings (Main Hall, Classrooms) through an integrated, user-friendly booking and scheduling engine.',
            pill: 'Spaces & Modules',
            preview: (
                <div className="w-full h-full flex flex-col justify-between p-7 bg-[#022c22]/40 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">EDUCATIONAL CALENDAR</span>
                            <h4 className="text-lg font-bold text-white mt-1">Solat, Classes &amp; Bookings</h4>
                        </div>
                        <CalendarRange className="w-5 h-5 text-[#80bea6]" />
                    </div>

                    <div className="space-y-2.5 my-5">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold text-white block">Syarahan Perdana: Tazkirah</span>
                                <span className="text-[9px] text-[#D4AF37] font-semibold block mt-0.5">Hall A • Tonight after Maghrib</span>
                            </div>
                            <span className="text-[10px] text-white/50">Imam Aris</span>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold text-white block">Tafsir Quran &amp; Tajweed</span>
                                <span className="text-[9px] text-[#80bea6] block mt-0.5">Classroom 2 • Saturday 10:00 AM</span>
                            </div>
                            <span className="text-[10px] text-white/50">Ustaz Hisham</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-white/40">
                        <span>Class registrations open: 12 pending approval</span>
                        <span className="text-[#80bea6] hover:underline cursor-pointer flex items-center gap-0.5">
                            Refine Schedule <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            )
        }
    ];

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12">
            {/* Selector Sidebar */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                    {tabs.map((tab, idx) => {
                        const isTabActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabSelect(tab.id, idx)}
                                className={`w-full text-left p-4.5 rounded-2xl border transition-all ${isTabActive
                                    ? 'bg-gradient-to-r from-[#064E3B]/20 to-transparent border-[#064E3B] text-white shadow-lg'
                                    : 'bg-transparent border-white/5 hover:border-white/10 text-white/60 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl transition-all ${isTabActive ? 'bg-[#064E3B] text-[#80bea6]' : 'bg-white/5 text-white/40'
                                        }`}>
                                        {tab.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-sm">{tab.name}</span>
                                            {isTabActive && (
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] px-1.5 py-0.5 bg-[#D4AF37]/15 rounded-md border border-[#D4AF37]/20">
                                                    {tab.pill}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-white/40 line-clamp-1 mt-0.5">{tab.title}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Small premium hint */}
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Modular Platform Scalability</h4>
                    <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                        All modules connect to the InsForge robust PostgreSQL engine natively with secure row-level access control.
                    </p>
                </div>
            </div>

            {/* Preview Viewport */}
            <div className="lg:col-span-7 flex flex-col">
                <div className="glass-card-dark p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl flex-1 flex flex-col justify-between min-h-[380px] hover:border-white/20 transition-all duration-300">
                    {/* Virtual Browser Chrome */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/20 rounded-t-2xl">
                        <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        </div>
                        <div className="bg-white/5 border border-white/5 px-6 py-1 rounded-lg text-[10px] text-white/50 tracking-wider font-mono">
                            masjidportal.com/dashboard/{currentTab.id}
                        </div>
                        <div className="w-8" />
                    </div>

                    {/* Core Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="mb-6">
                            <span className="inline-block text-[9px] font-bold bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] px-2 py-0.5 rounded-full uppercase tracking-widest mb-1.5">
                                {currentTab.pill}
                            </span>
                            <h3 className="text-xl font-bold text-white tracking-tight">{currentTab.title}</h3>
                            <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                                {currentTab.description}
                            </p>
                        </div>

                        <div className="flex-1 min-h-[220px]">
                            {currentTab.preview}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
