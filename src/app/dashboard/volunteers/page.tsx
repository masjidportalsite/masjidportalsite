import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Shift {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    status: string;
    volunteer_name: string | null;
}
interface Volunteer { id: number; full_name: string; email: string; }

async function getData(): Promise<{ shifts: Shift[]; volunteers: Volunteer[] }> {
    try {
        const [shiftsRes, volRes] = await Promise.all([
            pool.query(`
                SELECT v.id, v.title, v.start_time, v.end_time, v.status, u.full_name as volunteer_name
                FROM volunteer_shifts v
                LEFT JOIN users u ON v.user_id = u.id
                ORDER BY v.start_time ASC
            `),
            pool.query(`SELECT id, full_name, email FROM users ORDER BY full_name ASC`)
        ]);
        return { shifts: shiftsRes.rows, volunteers: volRes.rows };
    } catch {
        return { shifts: [], volunteers: [] };
    }
}

export default async function VolunteersPage() {
    const { shifts, volunteers } = await getData();

    async function assignVolunteer(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const title = formData.get('title') as string;
        const startTime = formData.get('startTime') as string;

        if (!userId || !title || !startTime) return;

        const endTime = new Date(new Date(startTime).getTime() + 4 * 60 * 60 * 1000).toISOString();

        try {
            await pool.query(
                'INSERT INTO volunteer_shifts (user_id, title, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5)',
                [userId, title, startTime, endTime, 'scheduled']
            );
        } catch { /* handle gracefully */ }
        revalidatePath('/dashboard/volunteers');
    }

    const statusColors: Record<string, string> = {
        scheduled: 'bg-[#e6eeff] text-[#003527] border-[#bfc9c3]/30',
        active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        completed: 'bg-brand-cream text-foreground/50 border-[#bfc9c3]/30',
        cancelled: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans w-full overflow-hidden">
            <header className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#003527] tracking-tight mb-2">Volunteer Rosters</h1>
                    <p className="text-foreground/60 font-medium text-sm md:text-base max-w-sm md:max-w-none">Assign resources, schedule mosque traffic control, and manage assignments.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#003527]/5 border border-[#003527]/10 rounded-lg min-h-[44px]">
                    <span className="material-symbols-outlined text-[#003527] text-lg">person_apron</span>
                    <span className="text-sm font-bold text-[#003527]">{shifts.length} Shifts</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-hidden w-full">
                {/* Assign Shift Form */}
                <Card className="col-span-1 lg:col-span-4 p-5 md:p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Assign Duty Shift</h2>
                        <p className="text-[11px] md:text-xs text-foreground/50 mt-1 font-medium leading-relaxed">Create a volunteer roster item for standard service days and events.</p>
                    </div>

                    <form action={assignVolunteer} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Selected Volunteer</label>
                            <select
                                name="userId"
                                required
                                className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="">Select Volunteer...</option>
                                {volunteers.length === 0 ? (
                                    <option disabled>No members found</option>
                                ) : volunteers.map(v => (
                                    <option key={v.id} value={v.id}>{v.full_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Duty Assignment Title</label>
                            <Input name="title" required placeholder="Security / Parking Support" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Start Time</label>
                            <input
                                name="startTime"
                                type="datetime-local"
                                required
                                className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2 min-h-[48px] md:min-h-[44px] bg-[#003527] hover:bg-[#064e3b] text-white py-3 rounded-lg text-sm md:text-base font-semibold shadow-lg shadow-[#003527]/20 active:scale-[0.98] transition-transform">
                            Assign Shift
                        </Button>
                    </form>
                </Card>

                {/* Duty Assignments Space */}
                <Card className="col-span-1 lg:col-span-8 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] w-full flex flex-col">
                    {shifts.length === 0 ? (
                        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center opacity-80 h-full min-h-[250px]">
                            <span className="material-symbols-outlined text-4xl md:text-5xl text-[#003527]/30 mb-4">person_apron</span>
                            <p className="text-lg md:text-xl font-bold text-[#404944] mb-1">No Shifts Scheduled</p>
                            <p className="text-xs md:text-sm text-foreground/40 font-medium max-w-xs">
                                Assign a duty shift using the form to organize the workforce.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* --- Mobile View (Card Stack) --- */}
                            <div className="md:hidden flex flex-col divide-y divide-[#bfc9c3]/20 w-full overflow-hidden">
                                {shifts.map((s) => (
                                    <div key={s.id} className="p-5 flex flex-col gap-3 bg-white w-full group">
                                        <div className="flex justify-between items-start gap-3 w-full">
                                            <div className="flex flex-col gap-0.5 max-w-[70%]">
                                                <span className="font-bold text-[#003527] text-base leading-snug">{s.title}</span>
                                                <div className="flex items-center gap-1.5 text-[#404944] text-xs font-medium mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">person</span>
                                                    <span className="truncate">{s.volunteer_name || 'Unassigned'}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest border shadow-sm ${statusColors[s.status] || statusColors.scheduled} whitespace-nowrap mt-0.5`}>
                                                {s.status}
                                            </span>
                                        </div>
                                        <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#bfc9c3]/30 flex items-center gap-2 mt-1">
                                            <span className="material-symbols-outlined text-[#735c00] text-lg">calendar_clock</span>
                                            <span className="text-xs font-semibold text-[#003527]">
                                                {new Date(s.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- Desktop View (Table) --- */}
                            <div className="hidden md:block overflow-x-auto w-full">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#f8f9ff] text-[#003527] border-b border-[#bfc9c3]/30">
                                        <tr>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Volunteer</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Duty Assignment</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Duty Schedule</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#bfc9c3]/20">
                                        {shifts.map((s) => (
                                            <tr key={s.id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#707974] bg-[#e6eeff] p-1.5 rounded-full text-sm">person</span>
                                                        <span className="font-semibold text-[#003527] text-sm">{s.volunteer_name || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-[#003527] font-semibold text-sm">{s.title}</td>
                                                <td className="p-4 text-[#707974] text-xs font-semibold bg-white">
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f8f9ff] border border-[#bfc9c3]/30 rounded-md shadow-sm">
                                                        <span className="material-symbols-outlined text-[#735c00] text-[14px]">calendar_clock</span>
                                                        {new Date(s.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs uppercase font-bold tracking-widest border shadow-sm ${statusColors[s.status] || statusColors.scheduled}`}>
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
