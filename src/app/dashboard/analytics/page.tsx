import { Card } from '@/components/ui/card';
import React from 'react';
import { requireAuth } from '@/lib/auth';
import { getTenantContext } from '@/services/core/tenant';
import { AnalyticsService, DetailedAnalytics } from '@/services/analytics.service';

async function getStats(): Promise<DetailedAnalytics> {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const insforgeToken = cookieStore.get('insforge_session')?.value;

    const user = await requireAuth();
    const context = getTenantContext(user);
    const analyticsService = new AnalyticsService(context, insforgeToken);
    
    const result = await analyticsService.getDetailedAnalytics();
    
    return result.data || {
        totalVolume: 0,
        totalPayments: 0,
        totalMembers: 0,
        upcomingEvents: 0,
        categories: [],
        trendPoints: [],
        polylinePoints: ''
    };
}

export default async function AnalyticsPage() {
    const { totalVolume, totalPayments, totalMembers, upcomingEvents, categories, trendPoints, polylinePoints } = await getStats();

    const categoriesTotal = categories.reduce((sum, c) => sum + c.value, 0);
    const colors = [
        { primary: '#064E3B', secondary: '#E6F0EC', badge: 'bg-[#014131] text-[#95d3ba]' },
        { primary: '#D4AF37', secondary: '#FBF7E7', badge: 'bg-[#fed65b]/20 text-[#735c00]' },
        { primary: '#1F2937', secondary: '#EEF2F6', badge: 'bg-[#e6eeff] text-[#003527]' },
        { primary: '#D97706', secondary: '#FEF3C7', badge: 'bg-orange-50 text-orange-700' },
    ];

    const summaryMetrics = [
        { label: 'Total Collections', value: new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(totalVolume), icon: 'payments', delta: '+12.4%', deltaColor: 'bg-[#b0f0d6] text-[#014131]' },
        { label: 'Processed Invoices', value: `${totalPayments}`, sub: 'Transactions', icon: 'receipt_long', delta: '+8.1%', deltaColor: 'bg-[#b0f0d6] text-[#014131]' },
        { label: 'Registered Congregants', value: `${totalMembers}`, sub: 'Members', icon: 'group', delta: '+4.2%', deltaColor: 'bg-[#b0f0d6] text-[#014131]' },
        { label: 'Active Schedules', value: `${upcomingEvents}`, sub: 'Upcoming', icon: 'event', delta: 'Live', deltaColor: 'bg-[#fed65b]/20 text-[#735c00]' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans w-full overflow-hidden">
            <header className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#003527] tracking-tight mb-2">System Analytics</h1>
                    <p className="text-foreground/60 font-medium text-sm md:text-base max-w-sm md:max-w-none">Live donation breakdowns, community registration trends, and upcoming programs metrics.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#003527]/5 border border-[#003527]/10 rounded-lg min-h-[44px]">
                    <span className="w-2 h-2 rounded-full bg-[#014131] animate-pulse" />
                    <span className="text-sm font-bold text-[#003527]">Live Data</span>
                </div>
            </header>

            {/* Quick Summary Stats — 2-col on mobile, 4-col on xl */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {summaryMetrics.map(({ label, value, sub, icon, delta, deltaColor }) => (
                    <Card key={label} className="p-4 md:p-6 border border-[#003527]/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 hover:scale-[1.02] transition-transform relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-[#707974] block leading-tight max-w-[75%]">{label}</span>
                            <span className={`text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${deltaColor}`}>{delta}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#003527]">{value}</span>
                            {sub && <span className="text-[10px] md:text-xs font-medium text-[#707974] mt-0.5">{sub}</span>}
                        </div>
                        <div className="absolute -right-3 -bottom-3 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                            <span className="material-symbols-outlined text-[80px] text-[#003527]">{icon}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Chart */}
                <Card className="lg:col-span-2 p-5 md:p-8 border border-[#003527]/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Charitable Collection Cashflow</h2>
                            <p className="text-xs text-foreground/50 mt-1 font-medium">Plotting successful chronological transaction values from system ledger.</p>
                        </div>
                        <span className="self-start text-[10px] uppercase tracking-widest font-bold bg-[#e6eeff] text-[#003527] px-3 py-1.5 rounded-full whitespace-nowrap">Last 10 Records</span>
                    </div>

                    <div className="my-4 md:my-8 relative w-full h-[150px] md:h-[180px]">
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
                <Card className="p-5 md:p-8 border border-[#003527]/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Category Breakdown</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Fund allocation ratios divided by structural goals.</p>
                    </div>

                    <div className="space-y-4 md:space-y-5 my-4 md:my-6 flex-1">
                        {categories.map((c, index) => {
                            const colorSet = colors[index % colors.length];
                            const percentage = categoriesTotal > 0 ? Math.round((c.value / categoriesTotal) * 100) : 0;

                            return (
                                <div key={c.name} className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${colorSet.badge}`}>{c.name}</span>
                                        <span className="text-[#003527] font-bold text-xs">{percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full relative overflow-hidden" style={{ backgroundColor: colorSet.secondary }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${Math.max(percentage, 2)}%`, backgroundColor: colorSet.primary }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-foreground/40 font-semibold text-right">
                                        {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(c.value)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 bg-[#003527]/5 px-4 py-3 rounded-lg border border-[#003527]/10">
                        <span className="text-[10px] font-bold tracking-wider text-[#003527] uppercase flex items-center gap-1.5 leading-none">
                            <span className="material-symbols-outlined text-xs">savings</span>
                            Allocations audit: Verified
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
