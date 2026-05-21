import React from 'react';
import { requireAuth } from '@/lib/auth';
import { getTenantContext } from '@/services/core/tenant';
import { AnalyticsService, DashboardStats, EngagementTrend } from '@/services/analytics.service';

async function getDashboardData(): Promise<{ stats: DashboardStats; trends: EngagementTrend[] }> {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const insforgeToken = cookieStore.get('insforge_session')?.value;

    const user = await requireAuth();
    const context = getTenantContext(user);
    const analyticsService = new AnalyticsService(context, insforgeToken);
    
    const [statsRes, trendsRes] = await Promise.all([
        analyticsService.getDashboardSummary(),
        analyticsService.getEngagementTrends()
    ]);

    return { 
        stats: statsRes.data || {
            totalMembers: 0,
            monthlyDonations: 0,
            activeProgramsCount: 0,
            pendingApprovalsCount: 0,
            activeVolunteersCount: 0,
            avgWeeklyAttendance: 0,
            nextEvent: null,
            eventCapacityLabel: 'Data unavailable'
        }, 
        trends: trendsRes.data || [] 
    };
}

const prayerTimes = [
    { name: 'Fajr', time: '05:12 AM', active: false },
    { name: 'Dhuhr', time: '12:45 PM', active: false },
    { name: 'Asr', time: '04:12 PM', active: true },
    { name: 'Maghrib', time: '07:02 PM', active: false },
    { name: 'Isha', time: '08:15 PM', active: false },
];

const recentActivity = [
    { icon: 'payments', color: 'text-[#735c00]', bg: 'bg-[#fed65b]/30', title: 'New Donation Received', desc: 'Anonymous donated RM 250 for Renovation Fund.', time: '2 minutes ago', border: 'border-[#064e3b]' },
    { icon: 'person_add', color: 'text-[#003527]', bg: 'bg-[#003527]/10', title: 'Member Registration', desc: 'Zaid Omar joined the community portal.', time: '45 minutes ago', border: 'border-[#bfc9c3]' },
    { icon: 'feedback', color: 'text-[#003527]', bg: 'bg-[#003527]/10', title: 'Maintenance Alert', desc: 'Light fixtures in Main Hall reported broken.', time: '3 hours ago', border: 'border-[#bfc9c3]' },
];

export default async function DashboardPage() {
    const { stats, trends } = await getDashboardData();
    const { 
        totalMembers, 
        monthlyDonations, 
        nextEvent, 
        eventCapacityLabel, 
        activeVolunteersCount: activeVolunteers,
        activeProgramsCount,
        pendingApprovalsCount,
        avgWeeklyAttendance
    } = stats;

    const formattedDonations = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(monthlyDonations);
    const donationGoal = 15000;
    const donationProgress = Math.min(Math.round((monthlyDonations / donationGoal) * 100), 100);

    const now = new Date();
    const islamicDateLabel = 'Monday, 24 Ramadan 1446';
    const gregLabel = now.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-[1440px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out overflow-x-hidden">

            {/* ── Welcome Header ────────────────────────────────────────── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl md:text-[48px] font-semibold text-[#003527] leading-tight tracking-[-0.02em]">
                        Masjid Al-Noor Central
                    </h1>
                    <p className="text-[#404944] mt-1 italic text-base md:text-lg">
                        A digital sanctuary for the community leaders.
                    </p>
                </div>
                <div className="mt-2 md:mt-0">
                    <p className="text-[#735c00] font-medium text-xl md:text-[24px] tracking-[-0.01em]">{islamicDateLabel}</p>
                    <p className="text-[#707974] text-xs font-bold uppercase tracking-widest">{gregLabel}</p>
                </div>
            </section>

            {/* ── Quick Actions (Horizontal scroll on mobile) ───────────── */}
            <div className="w-full relative">
                {/* Visual fade for mobile scroll hint */}
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#f8f9ff] to-transparent pointer-events-none md:hidden z-10" />
                <div className="flex overflow-x-auto pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 gap-4 flex-nowrap scrollbar-hide snap-x">
                    <a href="/dashboard/announcements" className="flex-shrink-0 snap-center min-w-[200px] flex items-center justify-center gap-2 bg-[#003527] text-white px-6 py-3 min-h-[48px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                        <span className="material-symbols-outlined">campaign</span>
                        Post Announcement
                    </a>
                    <a href="/dashboard/events" className="flex-shrink-0 snap-center min-w-[200px] flex items-center justify-center gap-2 border border-[#735c00]/40 bg-[#735c00]/5 text-[#735c00] px-6 py-3 min-h-[48px] rounded-xl hover:bg-[#735c00]/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                        <span className="material-symbols-outlined">calendar_month</span>
                        Manage Schedule
                    </a>
                    <a href="/dashboard/donations" className="flex-shrink-0 snap-center min-w-[200px] flex items-center justify-center gap-2 border border-[#735c00]/40 bg-[#735c00]/5 text-[#735c00] px-6 py-3 min-h-[48px] rounded-xl hover:bg-[#735c00]/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                        <span className="material-symbols-outlined">payments</span>
                        Record Donation
                    </a>
                </div>
            </div>

            {/* ── Main Bento Grid ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">

                {/* Left column — 8 cols */}
                <div className="lg:col-span-8 flex flex-col gap-6 w-full">

                    {/* Prayer Times Widget */}
                    <div className="glass-card p-5 md:p-6 w-full">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                            <h3 className="font-medium text-xl md:text-[24px] text-[#003527] flex items-center gap-2 tracking-[-0.01em]">
                                <span className="material-symbols-outlined">schedule</span>
                                Today&apos;s Schedule
                            </h3>
                            <div className="bg-[#fed65b] text-[#241a00] px-4 py-1.5 rounded-full text-xs font-bold animate-pulse prayer-glow self-start sm:self-auto min-h-[32px] flex items-center">
                                Next: Asr in 01:22:15
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 overflow-hidden">
                            {prayerTimes.map((pt) => (
                                <div
                                    key={pt.name}
                                    className={`p-4 rounded-xl text-center border transition-all ${pt.active
                                        ? 'border-[#735c00] border-2 bg-[#fed65b]/20 prayer-glow scale-[1.02] shadow-sm'
                                        : 'border-[#bfc9c3]/20 bg-white/40'
                                        }`}
                                >
                                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 ${pt.active ? 'text-[#735c00]' : 'text-[#404944]'}`}>
                                        {pt.name}
                                    </p>
                                    <p className="text-lg md:text-xl font-medium text-[#003527] tracking-[-0.01em]">{pt.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metric Cards — 2 col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">

                        {/* Total Jemaah */}
                        <div className="glass-card p-5 md:p-6 relative overflow-hidden group">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#404944] mb-3">Total Jemaah</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-2xl md:text-[32px] font-semibold text-[#003527] tracking-[-0.01em]">{totalMembers.toLocaleString()}</h4>
                                <span className="flex items-center text-[#014131] font-bold text-[10px] bg-[#b0f0d6] px-2.5 py-1 rounded-full shadow-sm">
                                    <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +4.2%
                                </span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[120px] text-[#003527]">group</span>
                            </div>
                        </div>

                        {/* Monthly Donations */}
                        <div className="glass-card p-5 md:p-6">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#404944] mb-3">Monthly Donations</p>
                            <div className="flex items-end justify-between mb-4 gap-2">
                                <h4 className="text-2xl md:text-[32px] font-semibold text-[#003527] tracking-[-0.01em] truncate">{formattedDonations}</h4>
                                <p className="text-[10px] md:text-xs font-medium text-[#404944] bg-[#e6eeff] px-2.5 py-1 rounded-md shrink-0">Goal: RM 15k</p>
                            </div>
                            <div className="w-full h-2.5 bg-[#bfc9c3]/20 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-[#fed65b] to-[#014131] rounded-full transition-all duration-1000"
                                    style={{ width: `${donationProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Active Programs */}
                        <div className="glass-card p-5 md:p-6 flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-[28px] font-medium text-[#003527] tracking-[-0.01em]">{activeProgramsCount}</h4>
                                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#404944]">Programs Active</p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527] flex-shrink-0 shadow-inner">
                                <span className="material-symbols-outlined text-2xl">event_available</span>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="glass-card p-5 md:p-6 flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-[28px] font-medium text-[#ba1a1a] tracking-[-0.01em]">{pendingApprovalsCount}</h4>
                                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#404944]">Require Approval</p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#ffdad6]/30 flex items-center justify-center text-[#ba1a1a] flex-shrink-0 shadow-inner">
                                <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            </div>
                        </div>

                        {/* Active Volunteers */}
                        <div className="glass-card p-5 md:p-6 flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-[28px] font-medium text-[#003527] tracking-[-0.01em]">{activeVolunteers}</h4>
                                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#404944]">Active Volunteers</p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-inner">
                                <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                            </div>
                        </div>

                        {/* Weekly Attendance */}
                        <div className="glass-card p-5 md:p-6 flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-[28px] font-medium text-[#003527] tracking-[-0.01em]">{avgWeeklyAttendance}</h4>
                                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#404944]">Avg. Weekly Attendance</p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fed65b]/20 flex items-center justify-center text-[#735c00] flex-shrink-0 shadow-inner">
                                <span className="material-symbols-outlined text-2xl">groups</span>
                            </div>
                        </div>

                    </div>

                    {/* Community Engagement Bar Chart */}
                    <div className="glass-card p-5 md:p-6 w-full overflow-hidden">
                        <h3 className="font-medium text-lg md:text-[24px] text-[#003527] mb-6 tracking-[-0.01em]">Community Engagement Trends</h3>
                        <div className="flex items-end justify-between h-40 md:h-48 px-1 md:px-4 gap-2 md:gap-4">
                            {trends.map((bar, i) => (
                                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group w-full">
                                    <span className="text-[9px] md:text-[10px] font-bold text-[#003527] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
                                        {bar.value}
                                    </span>
                                    <div
                                        className={`w-full max-w-[40px] md:max-w-none rounded-t-[4px] md:rounded-t-lg transition-all cursor-pointer ${i === 3
                                            ? 'bg-[#003527] hover:bg-[#064e3b]'
                                            : 'bg-[#95d3ba] hover:bg-[#80bea6]'
                                            }`}
                                        style={{ height: `${bar.height}%`, minHeight: '12px' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3 px-1 md:px-4">
                            {trends.map((bar) => (
                                <span key={bar.label} className="flex-1 text-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#404944]">{bar.label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — 4 cols */}
                <div className="lg:col-span-4 flex flex-col gap-6 w-full">

                    {/* Recent Activity */}
                    <div className="glass-card p-5 md:p-6 w-full">
                        <h3 className="font-medium text-lg md:text-[24px] text-[#003527] mb-6 tracking-[-0.01em]">Recent Activity</h3>
                        <div className="space-y-5">
                            {recentActivity.map((item, i) => (
                                <div key={i} className={`flex gap-3 items-start border-l-2 ${item.border} pl-4 pb-1`}>
                                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                        <span className={`material-symbols-outlined text-[20px] ${item.color}`}>{item.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#003527] truncate">{item.title}</p>
                                        <p className="text-[11px] md:text-xs text-[#404944] mt-1 leading-relaxed">{item.desc}</p>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#707974] mt-1.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#735c00] bg-[#735c00]/5 py-3 rounded-lg hover:bg-[#735c00]/10 transition-all min-h-[44px]">
                            View Detailed Log
                        </button>
                    </div>

                    {/* Mobile Only: Qibla compass moves up effectively on grid flow naturally */}
                    {/* Qibla Direction Card */}
                    <div className="rounded-[24px] overflow-hidden relative h-[250px] md:h-[300px] shadow-sm border border-[#bfc9c3]/20 group w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#003527] to-[#014131] islamic-pattern-dark" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/90 to-transparent flex flex-col justify-end p-5 md:p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-inner min-w-[50px] min-h-[50px] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[28px]">explore</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base md:text-lg">Qibla Direction</p>
                                    <p className="text-[#95d3ba] text-xs md:text-sm font-medium tracking-wide">291.5° North West</p>
                                </div>
                            </div>
                        </div>
                        {/* Compass decoration */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full border border-[rgba(212,175,55,0.4)] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <div className="w-[3px] h-10 md:h-12 bg-[#D4AF37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" style={{ transform: 'rotate(292deg)', transformOrigin: 'bottom center' }} />
                        </div>
                    </div>

                    {/* Next Event / Fallback Empty State */}
                    {nextEvent ? (
                        <div className="glass-card p-5 md:p-6 border-l-4 border-l-[#735c00] w-full">
                            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#735c00] mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">event_upcoming</span> Next Program</p>
                            <h4 className="text-base md:text-lg font-semibold text-[#003527] leading-snug line-clamp-2 mb-2">{nextEvent.title}</h4>
                            <p className="text-xs text-[#404944] mb-5 bg-white/50 p-2 rounded-lg inline-block border border-[#bfc9c3]/30">
                                {new Date(nextEvent.start_time).toLocaleDateString('en-MY', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                                <span className="text-[#404944] font-medium">{eventCapacityLabel}</span>
                                <span className="bg-[#fed65b] text-[#241a00] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-center sm:text-left text-[10px]">Active Registration</span>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-80 min-h-[150px] w-full">
                            <span className="material-symbols-outlined text-[32px] text-[#bfc9c3] mb-2">event_busy</span>
                            <h4 className="text-sm font-semibold text-[#404944]">No Upcoming Programs</h4>
                            <p className="text-xs text-[#707974] mt-1 max-w-[200px]">Create an event to start engaging with the community.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
