import pool from '@/lib/db';
import React from 'react';

interface StatData {
    totalMembers: number;
    monthlyDonations: number;
    nextEvent: { id: number; title: string; capacity: number; start_time: string } | null;
    eventCapacityLabel: string;
}

async function getDashboardStats(): Promise<StatData> {
    try {
        const [membersRes, donationsRes, eventRes] = await Promise.all([
            pool.query('SELECT COUNT(*) as count FROM users'),
            pool.query(`
                SELECT COALESCE(SUM(amount), 0) as total 
                FROM donations 
                WHERE status = 'successful' 
                AND extract(month from created_at) = extract(month from current_date)
                AND extract(year from created_at) = extract(year from current_date)
            `),
            pool.query(`
                SELECT id, title, capacity, start_time 
                FROM events 
                WHERE start_time > NOW() 
                ORDER BY start_time ASC LIMIT 1
            `)
        ]);

        const totalMembers = parseInt(membersRes.rows[0]?.count || '0', 10);
        const monthlyDonations = parseFloat(donationsRes.rows[0]?.total || '0');
        const nextEvent = eventRes.rows[0] || null;

        let eventCapacityLabel = 'No capacity set';
        if (nextEvent?.capacity) {
            try {
                const rsvpRes = await pool.query(
                    'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1',
                    [nextEvent.id]
                );
                const rsvpCount = parseInt(rsvpRes.rows[0]?.count || '0', 10);
                const percentage = Math.round((rsvpCount / nextEvent.capacity) * 100);
                eventCapacityLabel = `${percentage}% filled (${rsvpCount}/${nextEvent.capacity})`;
            } catch {
                eventCapacityLabel = `Capacity: ${nextEvent.capacity}`;
            }
        }

        return { totalMembers, monthlyDonations, nextEvent, eventCapacityLabel };
    } catch {
        return { totalMembers: 1248, monthlyDonations: 12450, nextEvent: null, eventCapacityLabel: 'N/A' };
    }
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

const chartBars = [
    { label: 'MON', height: 60, value: '820' },
    { label: 'TUE', height: 45, value: '610' },
    { label: 'WED', height: 85, value: '1.1k' },
    { label: 'THU', height: 100, value: '1.4k' },
    { label: 'FRI', height: 70, value: '950' },
    { label: 'SAT', height: 55, value: '740' },
];

export default async function DashboardPage() {
    const { totalMembers, monthlyDonations, nextEvent, eventCapacityLabel } = await getDashboardStats();

    const formattedDonations = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(monthlyDonations);
    const donationGoal = 15000;
    const donationProgress = Math.min(Math.round((monthlyDonations / donationGoal) * 100), 100);

    const now = new Date();
    const islamicDateLabel = 'Monday, 24 Ramadan 1446';
    const gregLabel = now.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-[1440px] mx-auto pb-20 md:pb-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {/* ── Welcome Header ────────────────────────────────────────── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-[48px] font-semibold text-[#003527] leading-tight tracking-[-0.02em]">
                        Masjid Al-Noor Central
                    </h1>
                    <p className="text-[#404944] mt-1 italic text-lg">
                        A digital sanctuary for the community leaders.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[#735c00] font-medium text-[24px] tracking-[-0.01em]">{islamicDateLabel}</p>
                    <p className="text-[#707974] text-[12px] font-bold uppercase tracking-widest">{gregLabel}</p>
                </div>
            </section>

            {/* ── Quick Actions ─────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-4">
                <a href="/dashboard/announcements" className="flex items-center gap-2 bg-[#003527] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                    <span className="material-symbols-outlined">campaign</span>
                    Post Announcement
                </a>
                <a href="/dashboard/events" className="flex items-center gap-2 border-2 border-[#735c00] text-[#735c00] px-6 py-3 rounded-xl hover:bg-[#735c00]/5 transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                    <span className="material-symbols-outlined">calendar_month</span>
                    Manage Schedule
                </a>
                <a href="/dashboard/donations" className="flex items-center gap-2 border-2 border-[#735c00] text-[#735c00] px-6 py-3 rounded-xl hover:bg-[#735c00]/5 transition-all duration-300 hover:scale-[1.02] active:scale-95 font-medium text-sm">
                    <span className="material-symbols-outlined">payments</span>
                    Record Donation
                </a>
            </div>

            {/* ── Main Bento Grid ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left column — 8 cols */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Prayer Times Widget */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-medium text-[24px] text-[#003527] flex items-center gap-2 tracking-[-0.01em]">
                                <span className="material-symbols-outlined">schedule</span>
                                Today's Schedule
                            </h3>
                            <div className="bg-[#fed65b] text-[#241a00] px-4 py-1 rounded-full text-xs font-bold animate-pulse prayer-glow">
                                Next: Asr in 01:22:15
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {prayerTimes.map((pt) => (
                                <div
                                    key={pt.name}
                                    className={`p-4 rounded-xl text-center border transition-all ${pt.active
                                        ? 'border-[#735c00] border-2 bg-[#fed65b]/20 prayer-glow'
                                        : 'border-[#bfc9c3]/10'
                                        }`}
                                >
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${pt.active ? 'text-[#735c00]' : 'text-[#404944]'}`}>
                                        {pt.name}
                                    </p>
                                    <p className="text-[24px] font-medium text-[#003527] tracking-[-0.01em]">{pt.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metric Cards — 2 col */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Total Jemaah */}
                        <div className="glass-card p-6 relative overflow-hidden">
                            <p className="text-[12px] font-bold uppercase tracking-widest text-[#404944] mb-3">Total Jemaah</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-[32px] font-semibold text-[#003527] tracking-[-0.01em]">{totalMembers.toLocaleString()}</h4>
                                <span className="flex items-center text-[#003527] font-bold text-xs bg-[#b0f0d6]/30 px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +4.2%
                                </span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <span className="material-symbols-outlined text-[120px] text-[#003527]">group</span>
                            </div>
                        </div>

                        {/* Monthly Donations */}
                        <div className="glass-card p-6">
                            <p className="text-[12px] font-bold uppercase tracking-widest text-[#404944] mb-3">Monthly Donations</p>
                            <div className="flex items-end justify-between mb-4">
                                <h4 className="text-[32px] font-semibold text-[#003527] tracking-[-0.01em]">{formattedDonations}</h4>
                                <p className="text-xs text-[#404944]">Goal: RM 15,000</p>
                            </div>
                            <div className="w-full h-2 bg-[#b0f0d6]/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#fed65b] to-[#003527] rounded-full transition-all duration-1000"
                                    style={{ width: `${donationProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Active Programs */}
                        <div className="glass-card p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527] flex-shrink-0">
                                <span className="material-symbols-outlined">event_available</span>
                            </div>
                            <div>
                                <h4 className="text-[24px] font-medium text-[#003527] tracking-[-0.01em]">8</h4>
                                <p className="text-[12px] font-bold uppercase tracking-widest text-[#404944]">Active Programs</p>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="glass-card p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#ffdad6]/20 flex items-center justify-center text-[#ba1a1a] flex-shrink-0">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <div>
                                <h4 className="text-[24px] font-medium text-[#ba1a1a] tracking-[-0.01em]">12</h4>
                                <p className="text-[12px] font-bold uppercase tracking-widest text-[#404944]">Pending Approvals</p>
                            </div>
                        </div>

                    </div>

                    {/* Community Engagement Bar Chart */}
                    <div className="glass-card p-6">
                        <h3 className="font-medium text-[24px] text-[#003527] mb-8 tracking-[-0.01em]">Community Engagement Trends</h3>
                        <div className="flex items-end gap-4 h-48 px-4">
                            {chartBars.map((bar, i) => (
                                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group">
                                    <span className="text-[10px] font-bold text-[#003527] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {bar.value}
                                    </span>
                                    <div
                                        className={`w-full rounded-t-lg transition-all cursor-pointer ${i === 3
                                                ? 'bg-[#003527] hover:bg-[#064e3b]'
                                                : 'bg-[#95d3ba] hover:bg-[#80bea6]'
                                            }`}
                                        style={{ height: `${bar.height}%`, minHeight: '8px' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-4">
                            {chartBars.map((bar) => (
                                <span key={bar.label} className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-[#404944]">{bar.label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — 4 cols */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Recent Activity */}
                    <div className="glass-card p-6">
                        <h3 className="font-medium text-[24px] text-[#003527] mb-6 tracking-[-0.01em]">Recent Activity</h3>
                        <div className="space-y-6">
                            {recentActivity.map((item, i) => (
                                <div key={i} className={`flex gap-3 items-start border-l-2 ${item.border} pl-4 pb-6`}>
                                    <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                                        <span className={`material-symbols-outlined text-[18px] ${item.color}`}>{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#003527]">{item.title}</p>
                                        <p className="text-xs text-[#404944] mt-0.5">{item.desc}</p>
                                        <p className="text-[10px] text-[#707974] mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-2 text-center text-xs font-bold uppercase tracking-widest text-[#735c00] hover:underline transition-all">
                            View All Activity
                        </button>
                    </div>

                    {/* Qibla Direction Card */}
                    <div className="rounded-[24px] overflow-hidden relative h-[300px] shadow-lg group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#003527] to-[#064e3b] islamic-pattern-dark" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/80 to-transparent flex flex-col justify-end p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full">
                                    <span className="material-symbols-outlined text-white text-[32px]">explore</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">Qibla Direction</p>
                                    <p className="text-white/80 text-sm">291.5° North West</p>
                                </div>
                            </div>
                        </div>
                        {/* Compass decoration */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center">
                            <div className="w-0.5 h-10 bg-[#D4AF37] rounded-full" style={{ transform: 'rotate(292deg)', transformOrigin: 'bottom center' }} />
                        </div>
                    </div>

                    {/* Next Event */}
                    {nextEvent && (
                        <div className="glass-card p-6">
                            <p className="text-[12px] font-bold uppercase tracking-widest text-[#735c00] mb-2">Next Program</p>
                            <h4 className="text-lg font-semibold text-[#003527] leading-snug line-clamp-2 mb-2">{nextEvent.title}</h4>
                            <p className="text-xs text-[#404944] mb-4">
                                {new Date(nextEvent.start_time).toLocaleDateString('en-MY', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[#404944] font-medium">{eventCapacityLabel}</span>
                                <span className="bg-[#fed65b] text-[#241a00] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Active</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
