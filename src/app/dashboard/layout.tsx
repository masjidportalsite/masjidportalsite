import React from 'react';
import { requireAuth } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. Centralized Auth Check (Server-side)
    // This ensures that unauthenticated users never even render the shell.
    const user = await requireAuth();

    return (
        <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col md:flex-row font-sans islamic-pattern">
            
            {/* 2. Client-side Navigation Logic */}
            <DashboardNav user={user} />

            {/* ── Main Content Area ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-[100dvh]">
                {/* Top App Bar (desktop only, fixed height) */}
                <header className="hidden md:flex items-center justify-between px-8 min-h-[64px] bg-[#f8f9ff]/70 backdrop-blur-xl border-b border-[#bfc9c3]/20 sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-[#003527]">
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
                        <span className="font-bold text-lg tracking-tight">MasjidPortal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#b0f0d6]/30 rounded-full border border-[#b0f0d6]">
                           <span className="w-2 h-2 rounded-full bg-[#064e3b] animate-pulse"></span>
                           <span className="text-[10px] font-bold text-[#064e3b] uppercase tracking-wider">Live System</span>
                        </div>
                        <button className="material-symbols-outlined text-[#404944] hover:bg-[#e6eeff]/50 p-2 min-h-[44px] min-w-[44px] rounded-full transition-all flex items-center justify-center">
                            notifications
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 pb-28 md:pb-10 overflow-auto relative z-10 w-full max-w-full">
                    {children}
                </main>
            </div>

        </div>
    );
}
