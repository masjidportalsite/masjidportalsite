import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2 font-display">System Settings</h1>
                    <p className="text-foreground/60 font-medium">Manage platform parameters, currency, timezones, and theme configurations.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Mosque Profile</h2>
                            <p className="text-xs text-foreground/50 mt-1 font-medium">Standard regional details and base settings.</p>
                        </div>

                        <div className="space-y-4 text-sm text-foreground/80 font-medium division-y division-brand-emerald/5">
                            <div className="flex justify-between items-center py-2 border-b border-brand-emerald/5">
                                <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Mosque Name</span>
                                <span className="font-bold text-brand-emerald text-sm">Masjid Portal Demo</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-brand-emerald/5">
                                <span className="opacity-60 text-xs uppercase tracking-widest font-bold">System Timezone</span>
                                <span className="text-foreground font-semibold text-sm">Asia/Kuala_Lumpur (GMT+8)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-brand-emerald/5">
                                <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Base Currency</span>
                                <div>
                                    <span className="text-foreground font-semibold text-sm mr-2">MYR</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-brand-gold/15 text-brand-emerald border border-brand-gold/20">Ringgit</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-brand-emerald/5 flex justify-end">
                        <Button variant="secondary" className="px-6 py-2 rounded-lg text-xs font-bold border-brand-gold text-brand-emerald hover:bg-brand-emerald/5 transition-all">
                            Edit Profile
                        </Button>
                    </div>
                </Card>

                {/* Theme & Design Card */}
                <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Theme Preferences</h2>
                            <p className="text-xs text-foreground/50 mt-1 font-medium">Configure active themes and display properties.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Visual Tone</label>
                                <select
                                    disabled
                                    className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/30 px-3 py-2 text-sm text-foreground/50 opacity-60 cursor-not-allowed"
                                >
                                    <option>Light Mode (Digital Sanctuary)</option>
                                    <option>Dark Mode (Night Serenity)</option>
                                </select>
                            </div>
                            <p className="text-xs text-brand-emerald bg-brand-emerald/5 p-3 rounded-lg border border-brand-emerald/10 font-semibold leading-relaxed">
                                ℹ️ The "Digital Sanctuary" light theme has been locked by system managers to maintain community branding safety.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-brand-emerald/5 flex justify-end">
                        <Button disabled className="px-6 py-2 rounded-lg text-xs font-bold opacity-50 cursor-not-allowed">
                            Apply Changes
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
