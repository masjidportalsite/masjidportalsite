import pool from '@/lib/db';
import { Card } from '@/components/ui/card';

const DAILY_PRAYER_TIMES = [
    { name: 'Fajr', arabic: 'الفجر', icon: 'wb_twilight', time: '05:12 AM', iqamah: '05:22 AM', active: false },
    { name: 'Syuruk', arabic: 'الشروق', icon: 'wb_sunny', time: '06:38 AM', iqamah: '—', active: false, info: true },
    { name: 'Dhuhr', arabic: 'الظهر', icon: 'light_mode', time: '12:45 PM', iqamah: '12:55 PM', active: false },
    { name: 'Asr', arabic: 'العصر', icon: 'wb_cloudy', time: '04:12 PM', iqamah: '04:22 PM', active: true },
    { name: 'Maghrib', arabic: 'المغرب', icon: 'wb_dusk', time: '07:02 PM', iqamah: '07:07 PM', active: false },
    { name: 'Isha', arabic: 'العشاء', icon: 'nightlight', time: '08:15 PM', iqamah: '08:25 PM', active: false },
];

const WEEKLY_SCHEDULE = [
    { day: 'Monday', date: 'May 19', fajr: '05:11', dhuhr: '12:45', asr: '04:12', maghrib: '07:01', isha: '08:15' },
    { day: 'Tuesday', date: 'May 20', fajr: '05:11', dhuhr: '12:45', asr: '04:13', maghrib: '07:02', isha: '08:16' },
    { day: 'Wednesday', date: 'May 21', fajr: '05:10', dhuhr: '12:45', asr: '04:13', maghrib: '07:02', isha: '08:16' },
    { day: 'Thursday', date: 'May 22', fajr: '05:10', dhuhr: '12:45', asr: '04:14', maghrib: '07:03', isha: '08:17' },
    { day: 'Friday', date: 'May 23', fajr: '05:09', dhuhr: '12:45', asr: '04:14', maghrib: '07:03', isha: '08:17' },
    { day: 'Saturday', date: 'May 24', fajr: '05:09', dhuhr: '12:45', asr: '04:15', maghrib: '07:04', isha: '08:18' },
    { day: 'Sunday', date: 'May 25', fajr: '05:08', dhuhr: '12:45', asr: '04:15', maghrib: '07:04', isha: '08:18' },
];

async function getSalatSettings() {
    try {
        const res = await pool.query("SELECT key, value FROM settings WHERE key LIKE 'prayer_%' LIMIT 20");
        return res.rows.reduce((acc: Record<string, string>, row: { key: string; value: string }) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
    } catch {
        return {} as Record<string, string>;
    }
}

export default async function PrayerTimesPage() {
    const settings = await getSalatSettings();
    const mosqueLocation = settings['prayer_location'] || 'Kuala Lumpur, Malaysia (3.1390° N, 101.6869° E)';
    const calculationMethod = settings['prayer_method'] || 'JAKIM (Malaysia)';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20 md:pb-0">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[40px] font-semibold text-[#003527] tracking-[-0.02em] leading-tight">Prayer Times</h1>
                    <p className="text-[#404944] mt-1">Daily Salat schedule for your congregation.</p>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-[#003527]/5 border border-[#003527]/10 rounded-xl">
                    <span className="material-symbols-outlined text-[#003527] text-xl">location_on</span>
                    <span className="text-sm font-semibold text-[#003527]">{mosqueLocation}</span>
                </div>
            </header>

            {/* Today's Prayer Times — Full Cards */}
            <section>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#707974] mb-4">Today's Schedule</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {DAILY_PRAYER_TIMES.map((prayer) => (
                        <div
                            key={prayer.name}
                            className={`rounded-[24px] p-6 border transition-all ${prayer.active
                                    ? 'border-[#735c00] border-2 bg-[#fed65b]/15 prayer-glow'
                                    : 'glass-card'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-xl ${prayer.active ? 'text-[#735c00]' : 'text-[#707974]'}`}>
                                        {prayer.icon}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${prayer.active ? 'text-[#735c00]' : 'text-[#707974]'}`}>
                                        {prayer.name}
                                    </span>
                                </div>
                                {prayer.active && (
                                    <span className="bg-[#fed65b] text-[#241a00] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse">
                                        Now
                                    </span>
                                )}
                            </div>
                            <p className="text-[32px] font-semibold text-[#003527] tracking-[-0.02em] leading-none mb-1">{prayer.time}</p>
                            <p className="text-xs font-medium text-[#404944]">
                                {prayer.iqamah === '—' ? (
                                    <span className="italic text-[#707974]">Sunrise — no Iqamah</span>
                                ) : (
                                    <>Iqamah: <span className="font-bold text-[#003527]">{prayer.iqamah}</span></>
                                )}
                            </p>
                            <p className="text-[20px] text-[#bfc9c3] font-medium mt-2 text-right">{prayer.arabic}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weekly Schedule Table */}
            <section>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#707974] mb-4">Weekly Schedule</h2>
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#003527]/5 border-b border-[#bfc9c3]/20">
                                <tr>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Day</th>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Fajr</th>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Dhuhr</th>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Asr</th>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Maghrib</th>
                                    <th className="p-4 text-[#003527] font-bold uppercase tracking-wider text-xs">Isha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#bfc9c3]/10">
                                {WEEKLY_SCHEDULE.map((row, i) => (
                                    <tr key={row.day} className={`transition-colors hover:bg-[#e6eeff]/30 ${i === 0 ? 'bg-[#003527]/[0.02]' : ''}`}>
                                        <td className="p-4">
                                            <span className="font-bold text-[#003527]">{row.day}</span>
                                            <span className="text-[#707974] text-xs ml-2">{row.date}</span>
                                        </td>
                                        <td className="p-4 font-semibold text-[#404944]">{row.fajr}</td>
                                        <td className="p-4 font-semibold text-[#404944]">{row.dhuhr}</td>
                                        <td className="p-4 font-semibold text-[#404944]">{row.asr}</td>
                                        <td className="p-4 font-semibold text-[#404944]">{row.maghrib}</td>
                                        <td className="p-4 font-semibold text-[#404944]">{row.isha}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* Settings Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#707974] mb-4">Calculation Method</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#003527]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#003527]">calculate</span>
                        </div>
                        <div>
                            <p className="font-bold text-[#003527]">{calculationMethod}</p>
                            <p className="text-xs text-[#707974] mt-0.5">Juristic method: Shafi'i</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#707974] mb-4">Jumu'ah Details</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fed65b]/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#735c00]">mosque</span>
                        </div>
                        <div>
                            <p className="font-bold text-[#003527]">Friday, 12:30 PM</p>
                            <p className="text-xs text-[#707974] mt-0.5">Khutbah begins 12:15 PM</p>
                        </div>
                    </div>
                </Card>
            </section>

        </div>
    );
}
