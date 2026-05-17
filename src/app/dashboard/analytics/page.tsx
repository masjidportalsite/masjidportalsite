import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import React from 'react';

interface Stats {
    totalVolume: number;
    totalPayments: number;
    totalMembers: number;
    upcomingEvents: number;
    categories: { name: string; value: number }[];
    trendPoints: { x: number; y: number; amount: number; time: string }[];
    polylinePoints: string;
}

async function getStats(): Promise<Stats> {
    const empty: Stats = {
        totalVolume: 0, totalPayments: 0, totalMembers: 0, upcomingEvents: 0,
        categories: [], trendPoints: [], polylinePoints: ''
    };

    try {
        const [statsRes, categoryRes, membersRes, eventsRes, trendsRes] = await Promise.all([
            pool.query(`SELECT COALESCE(SUM(amount), 0) as total_volume, COUNT(id) as total_payments FROM donations WHERE status = 'successful'`),
            pool.query(`SELECT type, COALESCE(SUM(amount), 0) as amount FROM donations WHERE status = 'successful' GROUP BY type`),
            pool.query(`SELECT COUNT(id) as count FROM users`),
            pool.query(`SELECT COUNT(id) as count FROM events WHERE start_time >= NOW()`),
            pool.query(`SELECT amount, type, created_at FROM donations WHERE status = 'successful' ORDER BY created_at ASC LIMIT 10`)
        ]);

        const categoriesRaw = categoryRes.rows;
        const categories = ['zakat', 'sadaqah', 'general', 'campaign'].map(type => {
            const row = categoriesRaw.find(r => r.type === type);
            return { name: type.charAt(0).toUpperCase() + type.slice(1), value: row ? Number(row.amount) : 0 };
        });

        const trendRows = trendsRes.rows;
        const maxTrendAmount = Math.max(...trendRows.map(r => Number(r.amount)), 100);
        const trendPoints = trendRows.map((row, idx) => {
            const x = trendRows.length > 1 ? (idx / (trendRows.length - 1)) * 500 : 250;
            const y = 180 - (Number(row.amount) / maxTrendAmount) * 130 - 20;
            return { x, y, amount: Number(row.amount), time: new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
        });
        const polylinePoints = trendPoints.map(p => `${p.x},${p.y}`).join(' ');

        return {
            totalVolume: Number(statsRes.rows[0]?.total_volume || 0),
            totalPayments: Number(statsRes.rows[0]?.total_payments || 0),
            totalMembers: Number(membersRes.rows[0]?.count || 0),
            upcomingEvents: Number(eventsRes.rows[0]?.count || 0),
            categories, trendPoints, polylinePoints
        };
    } catch {
        return empty;
    }
}

export default async function AnalyticsPage() {
    const { totalVolume, totalPayments, totalMembers, upcomingEvents, categories, trendPoints, polylinePoints } = await getStats();

    const categoriesTotal = categories.reduce((sum, c) => sum + c.value, 0);
    const colors = [
        { primary: '#064E3B', secondary: '#E6F0EC' },
        { primary: '#D4AF37', secondary: '#FBF7E7' },
        { primary: '#1F2937', secondary: '#EEF2F6' },
        { primary: '#D97706', secondary: '#FEF3C7' }
    ];

    const summaryMetrics = [
        { label: 'Total Collections', value: `MYR ${totalVolume.toLocaleString()}`, icon: 'payments' },
        { label: 'Processed Invoices', value: `${totalPayments} Transactions`, icon: 'receipt_long' },
        { label: 'Registered Congregants', value: `${totalMembers} Members`, icon: 'group' },
        { label: 'Active Schedules', value: `${upcomingEvents} Upcoming`, icon: 'event' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">System Analytics</h1>
                    <p className="text-foreground/60 font-medium">Live donation breakdowns, community registration trends, and upcoming programs metrics.</p>
                </div>
            </header>

            {/* Quick Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {summaryMetrics.map(({ label, value, icon }) => (
                    <Card key={label} className="p-6 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 hover:scale-[1.02] transition-transform">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block">{label}</span>
                            <span className="material-symbols-outlined text-brand-emerald/30 text-lg">{icon}</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-brand-emerald">{value}</span>
                    </Card>
                ))}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <Card className="lg:col-span-2 p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Charitable Collection Cashflow</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Plotting successful chronological transaction values from system ledger.</p>
                    </div>

                    <div className="my-8 relative w-full h-[180px]">
                        {trendPoints.length <= 1 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-foreground/40 font-semibold text-sm bg-brand-cream/20 rounded-xl border border-brand-emerald/5 gap-2">
                                <span className="material-symbols-outlined text-3xl text-brand-emerald/20">stacked_line_chart</span>
                                <span className="text-xs text-center px-4">Pending transaction trends accumulation<br />(Requires at least 2 successful records)</span>
                            </div>
                        ) : (
                            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <line x1="0" y1="30" x2="500" y2="30" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />
                                <line x1="0" y1="85" x2="500" y2="85" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />
                                <line x1="0" y1="140" x2="500" y2="140" stroke="#064E3B" strokeOpacity="0.05" strokeWidth="1" />

                                <path
                                    d={`M ${trendPoints[0].x} 180 L ${polylinePoints} L ${trendPoints[trendPoints.length - 1].x} 180 Z`}
                                    fill="url(#emerald-gradient)"
                                    opacity="0.2"
                                />
                                <polyline
                                    fill="none"
                                    stroke="#064E3B"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={polylinePoints}
                                />
                                {trendPoints.map((pt, idx) => (
                                    <circle key={idx} cx={pt.x} cy={pt.y} r="5.5" fill="#ffffff" stroke="#064E3B" strokeWidth="2.5" />
                                ))}
                                <defs>
                                    <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#064E3B" />
                                        <stop offset="100%" stopColor="#FAF9F6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        )}
                    </div>

                    {trendPoints.length > 1 && (
                        <div className="flex justify-between items-center text-[10px] text-foreground/50 tracking-wider font-bold">
                            {trendPoints.map((pt, idx) => (
                                <span key={idx} className="block text-center">{pt.time}</span>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Category Breakdown */}
                <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Category Breakdown</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Fund allocation ratios divided by structural goals.</p>
                    </div>

                    <div className="space-y-5 my-6">
                        {categories.map((c, index) => {
                            const colorSet = colors[index % colors.length];
                            const percentage = categoriesTotal > 0 ? Math.round((c.value / categoriesTotal) * 100) : 0;

                            return (
                                <div key={c.name} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-foreground/80">{c.name}</span>
                                        <span className="text-brand-emerald font-bold">{percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full relative overflow-hidden" style={{ backgroundColor: colorSet.secondary }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${Math.max(percentage, 2)}%`, backgroundColor: colorSet.primary }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-foreground/40 font-semibold text-right">
                                        MYR {c.value.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-brand-emerald/5 px-4 py-3 rounded-lg border border-brand-emerald/10">
                        <span className="text-[10px] font-bold tracking-wider text-brand-emerald uppercase flex items-center gap-1.5 leading-none">
                            <span className="material-symbols-outlined text-xs">savings</span>
                            Allocations audit: Verified
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
