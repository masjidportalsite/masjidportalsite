import { revalidatePath } from 'next/cache';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requireAuth } from '@/lib/auth';
import { getTenantContext } from '@/services/core/tenant';
import { EventService, Event } from '@/services/event.service';

async function getEvents(): Promise<Event[]> {
    const user = await requireAuth();
    const context = getTenantContext(user);
    const eventService = new EventService(context);
    
    const result = await eventService.getEvents();
    return result.data || [];
}

export default async function EventsPage() {
    const events = await getEvents();

    async function createEvent(formData: FormData) {
        'use server';
        const user = await requireAuth();
        const context = getTenantContext(user);
        const eventService = new EventService(context);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const capacity = parseInt(formData.get('capacity') as string);
        const startTime = formData.get('startTime') as string;

        if (!title || !startTime) return;

        const result = await eventService.createEvent({
            title,
            description,
            location,
            capacity,
            startTime
        });

        if (result.error) {
            console.error('[EventsPage] Failed to create event:', result.error.message);
        }

        revalidatePath('/dashboard/events');
    }

    const upcomingEvents = events.filter(e => new Date(e.start_time) >= new Date());
    const pastEvents = events.filter(e => new Date(e.start_time) < new Date());

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans w-full overflow-hidden">
            <header className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#003527] tracking-tight mb-2">Programs & Events</h1>
                    <p className="text-foreground/60 font-medium text-sm md:text-base max-w-sm md:max-w-none">Schedule weekly sermons, educational classes, community events, and special prayers.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#003527]/5 border border-[#003527]/10 rounded-lg min-h-[44px]">
                    <span className="material-symbols-outlined text-[#003527] text-lg">calendar_month</span>
                    <span className="text-sm font-bold text-[#003527]">{upcomingEvents.length} Upcoming</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-hidden w-full">
                {/* Create Event Form */}
                <Card className="col-span-1 lg:col-span-4 p-5 md:p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Schedule Program</h2>
                        <p className="text-[11px] md:text-xs text-foreground/50 mt-1 font-medium leading-relaxed">Add a new event or educational series to the schedule.</p>
                    </div>

                    <form action={createEvent} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Program Title</label>
                            <Input name="title" required placeholder="Jumuah Khutbah" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="flex w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-3 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 resize-none min-h-[80px]"
                                placeholder="Details about this gathering..."
                            />
                        </div>
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Venue / Location</label>
                            <Input name="location" placeholder="Main Prayer Hall" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Max Capacity</label>
                                <Input name="capacity" type="number" placeholder="500" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Date & Time</label>
                                <input
                                    name="startTime"
                                    type="datetime-local"
                                    required
                                    className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-2 sm:px-4 py-2 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2 min-h-[48px] md:min-h-[44px] bg-[#003527] hover:bg-[#064e3b] text-white py-3 rounded-lg text-sm md:text-base font-semibold shadow-lg shadow-[#003527]/20 active:scale-[0.98] transition-transform">
                            Publish Program
                        </Button>
                    </form>
                </Card>

                {/* Events List */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 w-full">
                    {events.length === 0 ? (
                        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center border border-dashed border-[#003527]/20 rounded-[24px] bg-white/40 h-full min-h-[250px]">
                            <span className="material-symbols-outlined text-4xl md:text-5xl text-[#003527]/30 mb-4">calendar_month</span>
                            <p className="text-lg md:text-xl font-bold text-[#404944] mb-1">No Programs Scheduled</p>
                            <p className="text-xs md:text-sm text-foreground/40 font-medium max-w-xs">
                                Schedule your first community program using the form to build a schedule.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full space-y-8">
                            {upcomingEvents.length > 0 && (
                                <div className="w-full">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#003527]/60 mb-4 px-1">Upcoming Programs</h3>
                                    <div className="flex flex-col gap-4 w-full">
                                        {upcomingEvents.map((event) => (
                                            <EventCard key={event.id} event={event} isPast={false} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {pastEvents.length > 0 && (
                                <div className="w-full">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#404944]/50 mb-4 px-1 mt-8">Past Programs</h3>
                                    <div className="flex flex-col gap-4 w-full opacity-60 hover:opacity-100 transition-opacity duration-300">
                                        {pastEvents.map((event) => (
                                            <EventCard key={event.id} event={event} isPast={true} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCard({ event, isPast }: { event: Event; isPast: boolean }) {
    const startDate = new Date(event.start_time);
    return (
        <Card className={`p-5 md:p-6 shadow-[0_15px_35px_-10px_rgba(6,78,59,0.05)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full ${isPast ? 'border-[#bfc9c3]/20 bg-white/50' : 'border-[#003527]/10 bg-white'}`}>
            {/* Date Badge */}
            <div className={`rounded-[16px] p-3 md:p-4 text-center min-w-[72px] md:min-w-20 flex-shrink-0 w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:block border ${isPast ? 'bg-[#f8f9ff] border-[#bfc9c3]/30' : 'bg-[#e6eeff] border-[#003527]/10 shadow-inner'}`}>
                <div className="flex flex-col items-center sm:block">
                    <span className={`block text-[10px] md:text-xs font-bold uppercase tracking-widest sm:mb-1 ${isPast ? 'text-[#707974]' : 'text-[#003527]'}`}>
                        {startDate.toLocaleString(undefined, { month: 'short' })}
                    </span>
                    <span className={`block text-2xl md:text-3xl font-extrabold tracking-tight leading-none ${isPast ? 'text-[#404944]' : 'text-[#003527]'}`}>
                        {startDate.getDate()}
                    </span>
                </div>
                <span className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-0 sm:mt-1.5 px-2 py-1 rounded-md ${isPast ? 'bg-[#bfc9c3]/20 text-[#404944]' : 'bg-[#003527] text-[#95d3ba]'}`}>
                    {startDate.toLocaleString(undefined, { weekday: 'short' })}
                </span>
            </div>

            <div className="flex-1 space-y-3 w-full min-w-0">
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#003527] tracking-tight leading-snug line-clamp-2">{event.title}</h3>
                    {event.description && (
                        <p className="text-xs md:text-sm text-foreground/70 mt-1 leading-relaxed font-medium line-clamp-2 md:line-clamp-3">{event.description}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 text-xs font-semibold text-[#404944]">
                    {event.location && (
                        <span className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#bfc9c3]/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
                            <span className="material-symbols-outlined text-[14px] text-[#003527]">place</span>
                            {event.location}
                        </span>
                    )}
                    {event.capacity && (
                        <span className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#bfc9c3]/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
                            <span className="material-symbols-outlined text-[14px] text-[#003527]">group</span>
                            {event.capacity} Capacity
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#bfc9c3]/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
                        <span className="material-symbols-outlined text-[14px] text-[#003527]">schedule</span>
                        {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </Card>
    );
}
