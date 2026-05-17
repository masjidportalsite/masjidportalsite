import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function VolunteersPage() {
    // Fetch Volunteer Shifts
    const res = await pool.query(`
        SELECT v.id, v.title, v.start_time, v.end_time, v.status, u.full_name as volunteer_name
        FROM volunteer_shifts v
        LEFT JOIN users u ON v.user_id = u.id
        ORDER BY v.start_time ASC
    `);
    const shifts = res.rows;

    // Fetch Users capable of volunteering
    const usersRes = await pool.query("SELECT id, full_name, email FROM users WHERE role IN ('volunteer', 'committee') ORDER BY full_name ASC");
    const volunteers = usersRes.rows;

    async function assignVolunteer(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const title = formData.get('title') as string;
        const startTime = formData.get('startTime') as string;

        if (!userId || !title || !startTime) return;

        const endTime = new Date(new Date(startTime).getTime() + 4 * 60 * 60 * 1000).toISOString();

        await pool.query(
            'INSERT INTO volunteer_shifts (user_id, title, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5)',
            [userId, title, startTime, endTime, 'scheduled']
        );
        revalidatePath('/dashboard/volunteers');
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2 font-display">Volunteer Rosters</h1>
                    <p className="text-foreground/60 font-medium">Assign resources, schedule mosque traffic control, and manage volunteer assignments.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assign Shift Form Card */}
                <Card className="p-8 col-span-1 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Assign Duty Shift</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Create a volunteer roster item for standard service days.</p>
                    </div>

                    <form action={assignVolunteer} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Selected Volunteer</label>
                            <select
                                name="userId"
                                required
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="">Select Volunteer...</option>
                                {volunteers.map(v => <option key={v.id} value={v.id}>{v.full_name} ({v.email})</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Duty Assignment Title</label>
                            <Input name="title" required placeholder="Security / Parking Support" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Start Time</label>
                            <input
                                name="startTime"
                                type="datetime-local"
                                required
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-brand-emerald hover:bg-brand-emerald/90 py-2.5 rounded-lg text-sm font-semibold">
                            Assign Shift
                        </Button>
                    </form>
                </Card>

                {/* Duty Assignments Ledger Table */}
                <Card className="col-span-1 lg:col-span-2 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-brand-emerald/5 text-brand-emerald border-b border-brand-emerald/10">
                                <tr>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Volunteer</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Duty Assignment</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Duty Schedule</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-emerald/5">
                                {shifts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-foreground/50 font-medium">No shifts scheduled at this time.</td>
                                    </tr>
                                ) : shifts.map((s) => (
                                    <tr key={s.id} className="hover:bg-brand-cream/50 transition-colors">
                                        <td className="p-4 font-medium text-brand-emerald text-sm">{s.volunteer_name || 'Unassigned'}</td>
                                        <td className="p-4 text-foreground font-semibold text-sm">{s.title}</td>
                                        <td className="p-4 text-foreground/60 text-xs font-semibold">
                                            {new Date(s.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 py-1 px-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-sm">
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
