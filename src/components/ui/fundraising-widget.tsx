/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

interface Donor {
    name: string;
    amount: string;
    time: string;
    avatar: string;
}

export default function FundraisingWidget() {
    const [progress, setProgress] = useState(62);
    const [currentAmount, setCurrentAmount] = useState(124350);
    const targetAmount = 200000;

    // Simulate passive donor additions over time
    const [donors, setDonors] = useState<Donor[]>([
        { name: 'Ahmad Rafiq', amount: 'RM 250', time: 'Just now', avatar: 'AR' },
        { name: 'Dr. Sarah Amin', amount: 'RM 1,000', time: '5 mins ago', avatar: 'SA' },
        { name: 'Keluarga Haji Zain', amount: 'RM 500', time: '12 mins ago', avatar: 'HZ' }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Add slight increments representing micro-infaq
            setCurrentAmount((prev) => {
                const delta = Math.floor(Math.random() * 80) + 10;
                const newAmt = prev + delta;
                const newProgress = Math.min(Math.floor((newAmt / targetAmount) * 100), 100);
                setProgress(newProgress);
                return newAmt;
            });
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative glass-card-dark p-8 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-2xl rounded-3xl group overflow-hidden">
            {/* Soft Gold light in bottom corner */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#D4AF37]/10 blur-[40px] rounded-full group-hover:scale-125 transition-all duration-700" />

            {/* Title block */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#80bea6] block mb-1">INFAQ &amp; WAQF INITIATIVE</span>
                    <h3 className="text-xl font-bold text-white">Grand Sanctuary Renovation</h3>
                    <span className="text-xs text-white/50 block mt-0.5">Phase 2: Modernization &amp; Carpet Replacement</span>
                </div>
                <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl p-2">
                    <Landmark className="w-5 h-5 text-[#D4AF37]" />
                </div>
            </div>

            {/* Progress display */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-white/40 text-xs">Collected</span>
                        <div className="text-3xl font-extrabold text-white tracking-tight leading-tight mt-1">
                            RM {currentAmount.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-white/30 block mt-0.5">Target: RM {targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1 text-[11px] bg-[#064E3B]/40 text-[#80bea6] px-2 py-0.5 rounded-full font-bold border border-[#064E3B]/50 mb-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>+18.4%</span>
                        </div>
                        <div className="text-3xl font-bold font-mono text-[#D4AF37] leading-none">
                            {progress}%
                        </div>
                    </div>
                </div>

                {/* Custom luxury progress bar */}
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <div
                        className="h-full bg-gradient-to-r from-[#064E3B] via-[#80bea6] to-[#D4AF37] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#80bea6]" />
                        Live Contributions
                    </span>
                    <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        🟢 Active
                    </span>
                </div>

                <div className="space-y-2.5">
                    {donors.map((d, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-2.5 bg-white/5 border border-white/5 rounded-xl transition-all hover:bg-white/10"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-full bg-[#064E3B]/40 text-[#80bea6] font-bold text-xs flex items-center justify-center border border-white/5">
                                    {d.avatar}
                                </span>
                                <div>
                                    <span className="text-xs font-semibold text-white block">{d.name}</span>
                                    <span className="text-[10px] text-white/40 block mt-0.5">{d.time}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-[#D4AF37] tracking-wider block">{d.amount}</span>
                                <span className="text-[9px] text-white/30 block">Electronic Transfer</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3.5">
                <button className="bg-transparent text-white/90 border border-white/15 px-4 py-3 rounded-xl font-semibold text-xs hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5">
                    View Accounts
                </button>
                <button className="bg-[#064E3B] text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md shadow-brand-emerald/10 hover:bg-[#0a6049] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider">
                    Contribute Instant Waqf
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
