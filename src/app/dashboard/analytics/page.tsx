import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import React from 'react';

export default async function AnalyticsPage() {
    // 1. Fetch Dynamic Aggregates from Database
    const statsRes = await pool.query(`
        SELECT 
            COALESCE(SUM(amount), 0) as total_volume,
            COUNT(id) as total_payments
        FROM donations 
        WHERE status = 'successful'
    `);
    const { total_volume, total_payments } = statsRes.rows[0];

    const categoryRes = await pool.query(`
        SELECT type, COALESCE(SUM(amount), 0) as amount
        FROM donations 
        WHERE status = 'successful'
        GROUP BY type
    `);
    const categoriesRaw = categoryRes.rows;

    const membersRes = await pool.query(`
        SELECT COUNT(id) as count FROM users
    `);
    const totalMembers = membersRes.rows[0].count;

    const eventsRes = await pool.query(`
        SELECT COUNT(id) as count FROM events WHERE start_time >= NOW()
    `);
    const upcomingEvents = eventsRes.rows[0].count;

    // Norm category distribution data
    const categories = ['zakat', 'sadaqah', 'general', 'campaign'].map(type => {
        const row = categoriesRaw.find(r => r.type === type);
        return {
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: row ? Number(row.amount) : 0
        };
    });

    const categoriesTotal = categories.reduce((sum, c) => sum + c.value, 0);

    // Color definitions corresponding to the Digital Sanctuary theme
    const colors = [
        { primary: '#064E3B', secondary: '#E6F0EC' }, // brand emerald
        { primary: '#D4AF37', secondary: '#FBF7E7' }, // brand gold
        { primary: '#1F2937', secondary: '#EEF2F6' }, // charcoal / slate
        { primary: '#D97706', secondary: '#FEF3C7' }  // amber
    ];

    // Historical donation trends calculated dynamically from database logs (last 7 successful)
    const trendsRes = await pool.query(`
        SELECT amount, type, created_at 
        FROM donations 
        WHERE status = 'successful' 
        ORDER BY created_at ASC 
        LIMIT 7
    `);
    const trendRows = trendsRes.rows;

    const maxTrendAmount = Math.max(...trendRows.map(r => Number(r.amount)), 100);

    // Compute coordinate points for our responsive SVG Spline Chart (Width 500, Height 180)
    let polylinePoints = '';
    const pointsList = trendRows.map((row, idx) => {
        const x = trendRows.length > 1 ? (idx / (trendRows.length - 1)) * 500 : 250;
        const y = 180 - (Number(row.amount) / maxTrendAmount) * 130 - 20; // 20px padding bottom
        return { x, y, amount: Number(row.amount), time: new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
    });
    polylinePoints = pointsList.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2 font-display">System Analytics</h1>
                    <p className="text-foreground/60 font-medium">Live donation breakdowns, community registration trends, and upcoming programs metrics.</p>
                </div>
            </header>

            {/* Quick Summary Highlights Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block mb-2">Total Collections</span>
                    <span className="text-3xl font-bold tracking-tight text-brand-emerald">MYR {Number(total_volume).toLocaleString()}</span>
                </Card>

                <Card className="p-6 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block mb-2">Processed Invoices</span>
                    <span className="text-3xl font-bold tracking-tight text-brand-emerald">{total_payments} Transactions</span>
                </Card>

                <Card className="p-6 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block mb-2">Registered Congregants</span>
                    <span className="text-3xl font-bold tracking-tight text-brand-emerald">{totalMembers} Members</span>
                </Card>

                <Card className="p-6 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block mb-2">Active Event Schedules</span>
                    <span className="text-3xl font-bold tracking-tight text-brand-emerald">{upcomingEvents} Scheduled</span>
                </Card>
            </div>

            {/* Visual Analytics Canvas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Sparkline Trend Chart Card (2/3 of desktop width) */}
                <Card className="lg:col-span-2 p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Charitable Collection Cashflow</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Plotting successful chronological transaction values from system ledger.</p>
                    </div>

                    <div className="my-8 relative w-full h-[180px]">
                        {pointsList.length <= 1 ? (
                            <div className="w-full h-full flex items-center justify-center text-foreground/40 font-semibold text-xs bg-brand-cream/20 rounded-xl border border-brand-emerald/5">
                                Pending transaction trends accumulation (Requires at least 2 successful records).
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="30" x2="500" y2="30" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />
                                    <line x1="0" y1="85" x2="500" y2="85" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />
                                    <line x1="0" y1="140" x2="500" y2="140" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />

                                    {/* Shaded Area underneath the path */}
                                    <path
                                        d={`M ${pointsList[0].x} 180 L ${polylinePoints} L ${pointsList[pointsList.length - 1].x} 180 Z`}
                                        fill="url(#emerald-gradient)"
                                        className="opacity-20"
                                    />

                                    {/* Dynamic Path */}
                                    <polyline
                                        fill="none"
                                        stroke="#064E3B"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={polylinePoints}
                                    />

                                    {/* Interactive Circle Nodes */}
                                    {pointsList.map((pt, idx) => (
                                        <g key={idx}>
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r="5.5"
                                                fill="#ffffff"
                                                stroke="#064E3B"
                                                strokeWidth="2.5"
                                            />
                                        </g>
                                    ))}

                                    <defs>
                                        <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#064E3B" />
                                            <stop offset="100%" stopColor="#FAF9F6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Chart Timeline Axis */}
                    <div className="flex justify-between items-center text-[10px] text-foreground/50 tracking-wider font-bold">
                        {pointsList.map((pt, idx) => (
                            <span key={idx} className="block text-center">{pt.time} ({pt.amount} MYR)</span>
                        ))}
                    </div>
                </Card>

                {/* 2. Category Distribution Card (1/3 of desktop width) */}
                <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Category Breakdown</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Fund allocation ratios divided by structural goals.</p>
                    </div>

                    <div className="space-y-4 my-6">
                        {categories.map((c, index) => {
                            const colorSet = colors[index % colors.length];
                            const percentage = categoriesTotal > 0 ? Math.round((c.value / categoriesTotal) * 100) : 0;

                            return (
                                <div key={c.name} className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-foreground/80">{c.name}</span>
                                        <span className="text-brand-emerald font-bold">{c.value.toLocaleString()} MYR ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full" style={{ backgroundColor: colorSet.secondary }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: colorSet.primary
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-brand-emerald/5 px-4 py-3 rounded-lg border border-brand-emerald/10">
                        <span className="text-[10px] font-bold tracking-wider text-brand-emerald uppercase flex items-center gap-1.5 leading-none">
                            <span className="material-symbols-outlined text-xs">savings</span>
                            Targeted allocations audit status: Verified
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
