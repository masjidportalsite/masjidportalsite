import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';

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
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Volunteers</h1>
                    <p className="text-gray-500">Manage community helpers and event assignments.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 col-span-1 border border-brand-emerald-dim shadow shadow-brand-emerald/10 h-max">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Assign Shift</h2>
                    <form action={assignVolunteer} className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Volunteer</label>
                            <select name="userId" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald">
                                <option value="">Select Volunteer...</option>
                                {volunteers.map(v => <option key={v.id} value={v.id}>{v.full_name} ({v.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Shift Title</label>
                            <input name="title" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="Traffic Control - Jumuah" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Start Time</label>
                            <input name="startTime" type="datetime-local" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" />
                        </div>
                        <button type="submit" className="w-full mt-4 bg-brand-gold text-brand-emerald-dim rounded p-2 font-bold hover:bg-amber-400 transition-colors shadow">
                            Assign
                        </button>
                    </form>
                </Card>

                <Card className="col-span-1 lg:col-span-2 overflow-hidden shadow-xl shadow-brand-emerald/5 border-t border-brand-emerald-dim">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1f2937] text-white">
                                <tr>
                                    <th className="p-4 font-semibold">Volunteer</th>
                                    <th className="p-4 font-semibold">Assignment</th>
                                    <th className="p-4 font-semibold">Schedule</th>
                                    <th className="p-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {shifts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">No shifts scheduled.</td>
                                    </tr>
                                ) : shifts.map((s) => (
                                    <tr key={s.id} className="hover:bg-brand-cream transition-colors">
                                        <td className="p-4 font-medium">{s.volunteer_name || 'Unknown'}</td>
                                        <td className="p-4 text-gray-900 font-semibold">{s.title}</td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(s.start_time).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs uppercase font-bold tracking-wider bg-brand-emerald text-white">
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
