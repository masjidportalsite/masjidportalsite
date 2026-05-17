import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Announcement {
    id: number;
    title: string;
    body: string;
    category: string;
    pinned: boolean;
    created_at: string;
    author_name?: string;
}

async function getAnnouncements(): Promise<Announcement[]> {
    try {
        // Try to query the announcements table — if it doesn't exist, handle gracefully
        const res = await pool.query(`
            SELECT a.id, a.title, a.body, a.category, a.pinned, a.created_at, u.full_name as author_name
            FROM announcements a
            LEFT JOIN users u ON a.posted_by = u.id
            ORDER BY a.pinned DESC, a.created_at DESC
            LIMIT 50
        `);
        return res.rows;
    } catch {
        return [];
    }
}

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements();

    async function postAnnouncement(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const body = formData.get('body') as string;
        const category = formData.get('category') as string;

        if (!title || !body) return;

        try {
            await pool.query(
                'INSERT INTO announcements (title, body, category, pinned) VALUES ($1, $2, $3, $4)',
                [title, body, category || 'general', false]
            );
            revalidatePath('/dashboard/announcements');
        } catch {
            // Table may not exist — silently handle
        }
    }

    const categoryColors: Record<string, string> = {
        general: 'bg-blue-50 text-blue-700 border-blue-100',
        event: 'bg-brand-gold/15 text-brand-emerald border-brand-gold/20',
        urgent: 'bg-red-50 text-red-700 border-red-100',
        reminder: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">Announcements</h1>
                    <p className="text-foreground/60 font-medium">Broadcast important updates, reminders, and news to the congregation.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Post Announcement Form */}
                <Card className="p-8 col-span-1 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Post Announcement</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Broadcast a message to all community members.</p>
                    </div>

                    <form action={postAnnouncement} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Title</label>
                            <Input name="title" required placeholder="Jumuah Prayer Change Notice" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Category</label>
                            <select
                                name="category"
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="general">General</option>
                                <option value="event">Event</option>
                                <option value="reminder">Reminder</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Message</label>
                            <textarea
                                name="body"
                                required
                                rows={5}
                                className="flex w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 resize-none"
                                placeholder="Enter your announcement message here..."
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-brand-emerald hover:bg-brand-emerald/90 py-2.5 rounded-lg text-sm font-semibold">
                            <span className="material-symbols-outlined text-sm mr-2">campaign</span>
                            Post Announcement
                        </Button>
                    </form>
                </Card>

                {/* Announcements Feed */}
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    {announcements.length === 0 ? (
                        <Card className="p-16 flex flex-col items-center justify-center text-center border border-dashed border-brand-emerald/20 bg-white/40 shadow-none">
                            <span className="material-symbols-outlined text-5xl text-brand-emerald/30 mb-4">campaign</span>
                            <p className="text-xl font-bold text-foreground/40 mb-1">No Announcements Yet</p>
                            <p className="text-sm text-foreground/30 font-medium max-w-xs">
                                Post your first announcement to keep the congregation informed.
                            </p>
                        </Card>
                    ) : announcements.map((ann) => (
                        <Card
                            key={ann.id}
                            className={`p-6 border shadow-[0_10px_30px_-8px_rgba(6,78,59,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(6,78,59,0.08)] transition-all duration-300 ${ann.pinned ? 'border-brand-gold/30 bg-brand-gold/5' : 'border-brand-emerald/10 bg-white/70'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {ann.pinned && (
                                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/20 px-2.5 py-1 rounded-full border border-brand-gold/30">
                                            <span className="material-symbols-outlined text-[10px]">push_pin</span>
                                            Pinned
                                        </span>
                                    )}
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${categoryColors[ann.category] || categoryColors.general}`}>
                                        {ann.category}
                                    </span>
                                </div>
                                <span className="text-xs text-foreground/40 font-medium whitespace-nowrap">
                                    {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-brand-emerald tracking-tight mb-2">{ann.title}</h3>
                            <p className="text-sm text-foreground/70 leading-relaxed font-medium">{ann.body}</p>
                            {ann.author_name && (
                                <div className="mt-4 pt-3 border-t border-brand-emerald/5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-foreground/30">person</span>
                                    <span className="text-xs text-foreground/40 font-semibold">{ann.author_name}</span>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
