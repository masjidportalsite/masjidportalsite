import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Event {
    id: number;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string | null;
    location: string | null;
    capacity: number | null;
}

async function getEvents(): Promise<Event[]> {
    try {
        const res = await pool.query(
            'SELECT id, title, description, start_time, end_time, location, capacity FROM events ORDER BY start_time ASC'
        );
        return res.rows;
    } catch {
        return [];
    }
}

export default async function EventsPage() {
    const events = await getEvents();

    async function createEvent(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const capacity = parseInt(formData.get('capacity') as string);
        const startTime = formData.get('startTime') as string;

        if (!title || !startTime) return;

        const endTime = new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000).toISOString();

        try {
            await pool.query(
                'INSERT INTO events (title, description, start_time, end_time, location, capacity) VALUES ($1, $2, $3, $4, $5, $6)',
                [title, description || null, startTime, endTime, location || null, capacity || 100]
            );
        } catch { /* handle gracefully */ }
        revalidatePath('/dashboard/events');
    }

    const upcomingEvents = events.filter(e => new Date(e.start_time) >= new Date());
    const pastEvents = events.filter(e => new Date(e.start_time) < new Date());

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">Programs & Events</h1>
                    <p className="text-foreground/60 font-medium">Schedule weekly sermons, educational classes, community events, and special prayers.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-emerald/5 border border-brand-emerald/10 rounded-lg">
                        <span className="material-symbols-outlined text-brand-emerald text-lg">calendar_month</span>
                        <span className="text-sm font-bold text-brand-emerald">{upcomingEvents.length} Upcoming</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Event Form */}
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
                                className="flex w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 resize-none"
                                placeholder="Details about this weekly gathering..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Venue / Location</label>
                            <Input name="location" placeholder="Main Prayer Hall" />
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

                {/* Events List */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {events.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center border border-dashed border-brand-emerald/20 rounded-[24px] bg-white/40">
                            <span className="material-symbols-outlined text-5xl text-brand-emerald/30 mb-4">calendar_month</span>
                            <p className="text-xl font-bold text-foreground/40 mb-1">No Programs Scheduled</p>
                            <p className="text-sm text-foreground/30 font-medium max-w-xs">
                                Schedule your first community program using the form on the left.
                            </p>
                        </div>
                    ) : (
                        <>
                            {upcomingEvents.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-emerald/60 mb-4 px-1">Upcoming Programs</h3>
                                    <div className="space-y-4">
                                        {upcomingEvents.map((event) => (
                                            <EventCard key={event.id} event={event} isPast={false} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {pastEvents.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-4 px-1 mt-8">Past Programs</h3>
                                    <div className="space-y-4 opacity-60">
                                        {pastEvents.map((event) => (
                                            <EventCard key={event.id} event={event} isPast={true} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCard({ event, isPast }: { event: Event; isPast: boolean }) {
    const startDate = new Date(event.start_time);
    return (
        <Card className={`p-6 shadow-[0_15px_35px_-10px_rgba(6,78,59,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(6,78,59,0.08)] hover:scale-[1.01] active:scale-100 transition-all duration-300 border flex flex-col sm:flex-row gap-5 items-start sm:items-center ${isPast ? 'border-brand-emerald/5' : 'border-brand-emerald/10'}`}>
            {/* Date Badge */}
            <div className={`rounded-[16px] p-4 text-center min-w-20 border flex-shrink-0 ${isPast ? 'bg-foreground/5 border-foreground/5' : 'bg-brand-emerald/5 border-brand-emerald/10'}`}>
                <span className={`block text-xs font-bold uppercase tracking-widest mb-1 ${isPast ? 'text-foreground/40' : 'text-brand-emerald'}`}>
                    {startDate.toLocaleString(undefined, { month: 'short' })}
                </span>
                <span className={`block text-3xl font-extrabold tracking-tight ${isPast ? 'text-foreground/40' : 'text-brand-emerald'}`}>
                    {startDate.getDate()}
                </span>
                <span className={`block text-[10px] font-bold uppercase tracking-wider mt-1.5 px-1 py-0.5 rounded-md ${isPast ? 'bg-foreground/10 text-foreground/30' : 'bg-brand-emerald text-brand-gold'}`}>
                    {startDate.toLocaleString(undefined, { weekday: 'short' })}
                </span>
            </div>

            <div className="flex-1 space-y-3 w-full min-w-0">
                <div>
                    <h3 className="text-lg font-bold text-brand-emerald tracking-tight leading-snug truncate">{event.title}</h3>
                    {event.description && (
                        <p className="text-sm text-foreground/70 mt-1 leading-relaxed font-medium line-clamp-2">{event.description}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-semibold text-foreground/60">
                    {event.location && (
                        <span className="flex items-center gap-1.5 bg-brand-cream/80 border border-brand-emerald/5 px-3 py-1.5 rounded-lg">
                            <span className="material-symbols-outlined text-[14px]">place</span>
                            {event.location}
                        </span>
                    )}
                    {event.capacity && (
                        <span className="flex items-center gap-1.5 bg-brand-cream/80 border border-brand-emerald/5 px-3 py-1.5 rounded-lg">
                            <span className="material-symbols-outlined text-[14px]">group</span>
                            {event.capacity} Capacity
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-brand-cream/80 border border-brand-emerald/5 px-3 py-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </Card>
    );
}
