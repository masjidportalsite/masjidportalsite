"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Compass, MapPin } from 'lucide-react';

interface PrayerTime {
    name: string;
    time: string;
    iqamah: string;
}

export default function PrayerWidget() {
    const [activeTab, setActiveTab] = useState<string>('Kuala Lumpur');
    const [timeRemaining, setTimeRemaining] = useState<string>('12:45');
    const [activePrayer, setActivePrayer] = useState<string>('Asr');

    const prayers: Record<string, PrayerTime[]> = {
        'Kuala Lumpur': [
            { name: 'Fajr', time: '05:48 AM', iqamah: '06:03 AM' },
            { name: 'Dhuhr', time: '01:12 PM', iqamah: '01:22 PM' },
            { name: 'Asr', time: '04:34 PM', iqamah: '04:46 PM' },
            { name: 'Maghrib', time: '07:22 PM', iqamah: '07:29 PM' },
            { name: 'Isha', time: '08:35 PM', iqamah: '08:45 PM' }
        ],
        'London': [
            { name: 'Fajr', time: '03:12 AM', iqamah: '03:27 AM' },
            { name: 'Dhuhr', time: '01:05 PM', iqamah: '01:15 PM' },
            { name: 'Asr', time: '05:18 PM', iqamah: '05:28 PM' },
            { name: 'Maghrib', time: '08:58 PM', iqamah: '09:05 PM' },
            { name: 'Isha', time: '10:30 PM', iqamah: '10:40 PM' }
        ],
        'New York': [
            { name: 'Fajr', time: '04:02 AM', iqamah: '04:17 AM' },
            { name: 'Dhuhr', time: '12:58 PM', iqamah: '01:08 PM' },
            { name: 'Asr', time: '04:55 PM', iqamah: '05:05 PM' },
            { name: 'Maghrib', time: '08:08 PM', iqamah: '08:15 PM' },
            { name: 'Isha', time: '09:35 PM', iqamah: '09:45 PM' }
        ]
    };

    // Simulating real-time ticking countdown to Asr iqamah
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                const [mins, secs] = prev.split(':').map(Number);
                if (mins === 0 && secs === 0) return '10:00';
                if (secs === 0) return `${mins - 1}:59`;
                return `${mins}:${secs < 11 ? '0' + (secs - 1) : secs - 1}`;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative glass-card-dark p-8 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-2xl rounded-3xl group overflow-hidden">
            {/* Background soft teal glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#80bea6]/10 blur-[40px] rounded-full group-hover:scale-125 transition-all duration-700" />

            {/* Header Info */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">Live Sanctuary Sync</span>
                    <div className="flex items-center gap-1.5 text-white">
                        <MapPin className="w-4 h-4 text-[#80bea6]" />
                        <span className="font-semibold text-sm">{activeTab}</span>
                    </div>
                </div>

                {/* Region toggles */}
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                    {Object.keys(prayers).map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setActiveTab(loc)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${activeTab === loc
                                ? 'bg-[#064E3B] text-white shadow-md'
                                : 'text-white/40 hover:text-white/70'
                                }`}
                        >
                            {loc.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Countdown Card */}
            <div className="bg-gradient-to-br from-[#022c22]/60 to-[#0c1a16]/60 border border-[#064E3B]/30 rounded-2xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-15">
                    <Compass className="w-16 h-16 text-[#D4AF37] animate-pulse" />
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#80bea6]">UPCOMING IQAMAH</span>
                        <h3 className="text-2xl font-bold text-white mt-1">Asr Prayer</h3>
                        <span className="text-xs text-white/50 block mt-1">Solat time starts 04:34 PM</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">COUNTDOWN</span>
                        <div className="text-2xl font-mono text-[#D4AF37] font-semibold tracking-wider tabular-nums bg-black/40 px-3 py-1 rounded-lg border border-white/5 inline-block">
                            {timeRemaining}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table grid of prayers */}
            <div className="grid grid-cols-5 gap-3">
                {prayers[activeTab].map((p) => {
                    const isActive = p.name === activePrayer;
                    return (
                        <div
                            key={p.name}
                            className={`p-3.5 rounded-xl border text-center transition-all ${isActive
                                ? 'bg-gradient-to-b from-[#064E3B]/40 to-[#022c22]/40 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.03]'
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <span className={`text-[10px] font-bold uppercase block tracking-wider ${isActive ? 'text-[#D4AF37]' : 'text-white/40'}`}>
                                {p.name}
                            </span>
                            <span className={`text-xs font-semibold block mt-1 ${isActive ? 'text-white font-bold' : 'text-white/80'}`}>
                                {p.time.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-white/30 block mt-0.5">Iqamah</span>
                            <span className={`text-[10px] font-bold block ${isActive ? 'text-[#80bea6]' : 'text-[#80bea6]/70'}`}>
                                {p.iqamah.split(' ')[0]}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Sync proof */}
            <div className="flex items-center gap-2 mt-5 text-[11px] text-white/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#80bea6]" />
                <span>Astronomical calculation linked with Jabatan Kemajuan Islam Malaysia (JAKIM)</span>
            </div>
        </div>
    );
}
