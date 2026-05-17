import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';

export default async function EventsPage() {
    const res = await pool.query('SELECT id, title, description, start_time, end_time, location, capacity FROM events ORDER BY start_time ASC');
    const events = res.rows;

    async function createEvent(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const capacity = parseInt(formData.get('capacity') as string);
        const startTime = formData.get('startTime') as string;

        if (!title || !startTime) return;

        // Simple end time as start time + 2 hours for demo purposes
        const endTime = new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000).toISOString();

        await pool.query(
            'INSERT INTO events (title, description, start_time, end_time, location, capacity) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, description, startTime, endTime, location, capacity || 100]
        );
        revalidatePath('/dashboard/events');
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Events & Classes</h1>
                    <p className="text-gray-500">Schedule and manage community gatherings.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 col-span-1 border border-brand-emerald-dim shadow shadow-brand-emerald/10 h-max">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Create Event</h2>
                    <form action={createEvent} className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Title</label>
                            <input name="title" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="Jumuah Khutbah" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Description</label>
                            <textarea name="description" rows={3} className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="Weekly Friday prayers..."></textarea>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Location</label>
                            <input name="location" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="Main Prayer Hall" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Capacity</label>
                                <input name="capacity" type="number" className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="500" />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Start Time</label>
                                <input name="startTime" type="datetime-local" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" />
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-4 bg-brand-emerald text-brand-cream rounded p-2 font-bold hover:bg-brand-emerald-dim transition-colors shadow">
                            Publish Event
                        </button>
                    </form>
                </Card>

                <div className="col-span-1 lg:col-span-2 space-y-4">
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">No upcoming events.</div>
                    ) : events.map((event) => (
                        <Card key={event.id} className="p-6 shadow shadow-brand-emerald/5 hover:scale-[1.01] transition-transform border border-brand-emerald/10 flex flex-col sm:flex-row gap-6 items-center">
                            <div className="bg-emerald-50 rounded-lg p-4 text-center min-w-24">
                                <span className="block text-sm font-bold text-brand-emerald uppercase tracking-wider">
                                    {new Date(event.start_time).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="block text-3xl font-extrabold text-brand-emerald">
                                    {new Date(event.start_time).getDate()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-md">
                                    <span>📍 {event.location}</span>
                                    <span>👥 {event.capacity} Max</span>
                                    <span>🕒 {new Date(event.start_time).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
