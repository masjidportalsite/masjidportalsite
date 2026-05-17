'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SettingsPage() {
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        mosqueName: 'Masjid Portal Demo',
        city: 'Kuala Lumpur',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        currency: 'MYR',
        contactEmail: 'admin@masjid.local',
        contactPhone: '+60 3-1234 5678',
    });
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setProfileData({
            mosqueName: data.get('mosqueName') as string || profileData.mosqueName,
            city: data.get('city') as string || profileData.city,
            country: data.get('country') as string || profileData.country,
            timezone: data.get('timezone') as string || profileData.timezone,
            currency: data.get('currency') as string || profileData.currency,
            contactEmail: data.get('contactEmail') as string || profileData.contactEmail,
            contactPhone: data.get('contactPhone') as string || profileData.contactPhone,
        });
        setEditingProfile(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">System Settings</h1>
                    <p className="text-foreground/60 font-medium">Manage platform parameters, currency, timezones, and contact configurations.</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-semibold animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Settings saved!
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mosque Profile Card */}
                <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col">
                    <div className="space-y-1 mb-6">
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Mosque Profile</h2>
                        <p className="text-xs text-foreground/50 font-medium">Standard regional details and base settings.</p>
                    </div>

                    {editingProfile ? (
                        <form onSubmit={handleSave} className="space-y-4 flex-1">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Mosque Name</label>
                                <Input name="mosqueName" defaultValue={profileData.mosqueName} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">City</label>
                                    <Input name="city" defaultValue={profileData.city} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Country</label>
                                    <Input name="country" defaultValue={profileData.country} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Contact Email</label>
                                <Input name="contactEmail" type="email" defaultValue={profileData.contactEmail} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Contact Phone</label>
                                <Input name="contactPhone" defaultValue={profileData.contactPhone} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Timezone</label>
                                <select name="timezone" defaultValue={profileData.timezone}
                                    className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200">
                                    <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option>
                                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                    <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="bg-brand-emerald hover:bg-brand-emerald/90 text-white px-6 py-2 text-sm font-semibold">
                                    Save Changes
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setEditingProfile(false)} className="px-6 py-2 text-sm">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="space-y-3 text-sm text-foreground/80 font-medium flex-1">
                                {[
                                    { label: 'Mosque Name', value: profileData.mosqueName },
                                    { label: 'Location', value: `${profileData.city}, ${profileData.country}` },
                                    { label: 'Timezone', value: `${profileData.timezone} (GMT+8)` },
                                    { label: 'Base Currency', value: profileData.currency },
                                    { label: 'Contact Email', value: profileData.contactEmail },
                                    { label: 'Contact Phone', value: profileData.contactPhone },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center py-2.5 border-b border-brand-emerald/5 last:border-0">
                                        <span className="opacity-60 text-xs uppercase tracking-widest font-bold">{label}</span>
                                        <span className="font-semibold text-brand-emerald text-sm text-right max-w-[60%] truncate">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-brand-emerald/5 flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => setEditingProfile(true)}
                                    className="px-6 py-2 rounded-lg text-xs font-bold border-brand-gold text-brand-emerald hover:bg-brand-emerald/5 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">edit</span>
                                    Edit Profile
                                </Button>
                            </div>
                        </>
                    )}
                </Card>

                {/* System Info & Theme Card */}
                <div className="flex flex-col gap-6">
                    <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                        <div className="space-y-1 mb-6">
                            <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Theme Preferences</h2>
                            <p className="text-xs text-foreground/50 font-medium">Configure active themes and display properties.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Visual Tone</label>
                                <select disabled className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/30 px-3 py-2 text-sm text-foreground/50 opacity-60 cursor-not-allowed">
                                    <option>Light Mode (Digital Sanctuary)</option>
                                    <option>Dark Mode (Night Serenity)</option>
                                </select>
                            </div>
                            <p className="text-xs text-brand-emerald bg-brand-emerald/5 p-3 rounded-lg border border-brand-emerald/10 font-semibold leading-relaxed">
                                ℹ️ The &ldquo;Digital Sanctuary&rdquo; light theme is locked to maintain community branding safety.
                            </p>
                        </div>
                    </Card>

                    <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                        <div className="space-y-1 mb-6">
                            <h2 className="text-xl font-bold text-brand-emerald tracking-tight">System Information</h2>
                            <p className="text-xs text-foreground/50 font-medium">Platform version and deployment details.</p>
                        </div>
                        <div className="space-y-3 text-sm">
                            {[
                                { label: 'Platform', value: 'MasjidPortal v1.0' },
                                { label: 'Framework', value: 'Next.js 16 + PostgreSQL' },
                                { label: 'Design System', value: 'Digital Sanctuary' },
                                { label: 'Environment', value: process.env.NODE_ENV === 'production' ? 'Production' : 'Development' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-brand-emerald/5 last:border-0">
                                    <span className="opacity-60 text-xs uppercase tracking-widest font-bold">{label}</span>
                                    <span className="font-semibold text-foreground text-xs">{value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
