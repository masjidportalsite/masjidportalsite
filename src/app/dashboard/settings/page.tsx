import { Card } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Settings</h1>
                    <p className="text-gray-500">Configure your platform preferences and profile.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 border border-brand-emerald-dim shadow shadow-brand-emerald/10">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Mosque Profile</h2>
                    <div className="space-y-4 text-sm text-gray-600">
                        <p><strong>Name:</strong> Masjid Portal Demo</p>
                        <p><strong>Timezone:</strong> Asia/Kuala_Lumpur (GMT+8)</p>
                        <p><strong>Currency:</strong> MYR</p>
                        <hr className="my-4" />
                        <button className="bg-brand-emerald text-brand-cream px-4 py-2 rounded">Edit Profile</button>
                    </div>
                </Card>

                <Card className="p-6 border border-brand-emerald-dim shadow shadow-brand-emerald/10">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Theme Preferences</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Color Mode</label>
                            <select disabled className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded opacity-50 cursor-not-allowed">
                                <option>Light (Digital Sanctuary)</option>
                                <option>Dark</option>
                            </select>
                            <p className="text-xs text-gray-400 mt-1">Locked by administrator.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
