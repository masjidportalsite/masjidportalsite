import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2 font-display">Programs & Events</h1>
                    <p className="text-foreground/60 font-medium">Schedule weekly sermons, educational classes, community events, and special prayers.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Event Card */}
                <Card className="p-8 col-span-1 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Schedule Program</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Add a new event or educational series to the schedule.</p>
                    </div>

                    <form action={createEvent} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Program Title</label>
                            <Input name="title" required placeholder="Jumuah Khutbah" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="flex w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                                placeholder="Details about this weekly gathering..."
                            ></textarea>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Venue / Location</label>
                            <Input name="location" required placeholder="Main Prayer Hall" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Max Capacity</label>
                                <Input name="capacity" type="number" placeholder="500" />
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
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-brand-emerald hover:bg-brand-emerald/90 py-2.5 rounded-lg text-sm font-semibold">
                            Publish Program
                        </Button>
                    </form>
                </Card>

                {/* Scheduled Programs list */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {events.length === 0 ? (
                        <div className="p-12 text-center text-foreground/50 border border-dashed border-brand-emerald/20 rounded-[24px] font-medium bg-white/40">
                            No upcoming programs scheduled yet.
                        </div>
                    ) : events.map((event) => (
                        <Card
                            key={event.id}
                            className="p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(6,78,59,0.08)] hover:scale-[1.02] active:scale-100 transition-all duration-300 border border-brand-emerald/10 flex flex-col sm:flex-row gap-6 items-center"
                        >
                            {/* Premium Calendar Date badge */}
                            <div className="bg-brand-emerald/5 rounded-[20px] p-4 text-center min-w-28 border border-brand-emerald/10 shadow-sm">
                                <span className="block text-xs font-bold text-brand-emerald uppercase tracking-widest mb-1">
                                    {new Date(event.start_time).toLocaleString(undefined, { month: 'short' })}
                                </span>
                                <span className="block text-4xl font-extrabold text-brand-emerald tracking-tight">
                                    {new Date(event.start_time).getDate()}
                                </span>
                                <span className="block text-[10px] font-bold text-brand-gold uppercase tracking-wider mt-1.5 bg-brand-emerald px-1 py-0.5 rounded-md">
                                    {new Date(event.start_time).toLocaleString(undefined, { weekday: 'short' })}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-emerald tracking-tight leading-snug">{event.title}</h3>
                                    <p className="text-sm text-foreground/75 mt-1 leading-relaxed font-medium">{event.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-foreground/60 bg-brand-cream/60 border border-brand-emerald/5 px-4 py-2.5 rounded-xl shadow-inner w-max max-w-full">
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">place</span>
                                        {event.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">group</span>
                                        {event.capacity} Max Capacity
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {new Date(event.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
