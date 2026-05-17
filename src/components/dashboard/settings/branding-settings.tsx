/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBranding, BrandingSettings } from "@/components/providers/branding-provider";

const PRESETS = {
    modern_islamic: {
        template_name: "Modern Islamic",
        primary_color: "#10b981",
        secondary_color: "#059669",
        accent_color: "#fbbf24",
        background_color: "#ffffff",
        text_color: "#171717",
        heading_font: "Inter",
        border_radius: "0.5rem"
    },
    corporate_ngo: {
        template_name: "Corporate NGO",
        primary_color: "#2563eb",
        secondary_color: "#1d4ed8",
        accent_color: "#3b82f6",
        background_color: "#f8fafc",
        text_color: "#0f172a",
        heading_font: "Roboto",
        border_radius: "0.25rem"
    },
    community_friendly: {
        template_name: "Community Friendly",
        primary_color: "#f97316",
        secondary_color: "#ea580c",
        accent_color: "#14b8a6",
        background_color: "#fff7ed",
        text_color: "#431407",
        heading_font: "Nunito",
        border_radius: "1rem"
    }
};

export function BrandingSettingsPanel() {
    const { settings, isLoading, updateSettings, refreshSettings } = useBranding();
    const [formData, setFormData] = useState<Partial<BrandingSettings>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyPreset = (presetKey: keyof typeof PRESETS) => {
        const preset = PRESETS[presetKey];
        setFormData((prev) => ({ ...prev, ...preset }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/branding", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                updateSettings(formData);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save branding settings", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-sm font-semibold opacity-60 animate-pulse">Loading Branding Settings...</div>;

    return (
        <Card className="p-5 md:p-8 border border-[#003527]/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Branding & Appearance</h2>
                    <p className="text-xs text-foreground/50 font-medium">Customize the platform identity and colors for your community.</p>
                </div>
                {saveSuccess && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                        Saved
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Templates */}
                <section>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1 mb-3">Template Presets</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button type="button" onClick={() => applyPreset("modern_islamic")} className="p-3 border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all">
                            <span className="block text-sm font-bold text-emerald-600 mb-1">Modern Islamic</span>
                            <span className="block text-xs opacity-60">Emerald & Gold styling</span>
                        </button>
                        <button type="button" onClick={() => applyPreset("corporate_ngo")} className="p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-left transition-all">
                            <span className="block text-sm font-bold text-blue-600 mb-1">Corporate NGO</span>
                            <span className="block text-xs opacity-60">Professional blue layout</span>
                        </button>
                        <button type="button" onClick={() => applyPreset("community_friendly")} className="p-3 border rounded-xl hover:border-orange-500 hover:bg-orange-50 text-left transition-all">
                            <span className="block text-sm font-bold text-orange-600 mb-1">Community Friendly</span>
                            <span className="block text-xs opacity-60">Warm tones, rounded</span>
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Brand Site Name</label>
                            <Input name="site_name" value={formData.site_name || ""} onChange={handleChange} className="min-h-[44px]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Logo URL</label>
                            <Input name="logo_url" value={formData.logo_url || ""} onChange={handleChange} placeholder="https://..." className="min-h-[44px]" />
                            <p className="text-[10px] text-foreground/40 px-1">Upload functionality via CMS or direct URL.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Favicon URL</label>
                            <Input name="favicon_url" value={formData.favicon_url || ""} onChange={handleChange} placeholder="https://..." className="min-h-[44px]" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Primary Color</label>
                                <div className="flex gap-2">
                                    <Input type="color" name="primary_color" value={formData.primary_color || "#10b981"} onChange={handleChange} className="w-12 p-1" />
                                    <Input name="primary_color" value={formData.primary_color || ""} onChange={handleChange} className="flex-1" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Accent Color</label>
                                <div className="flex gap-2">
                                    <Input type="color" name="accent_color" value={formData.accent_color || "#3b82f6"} onChange={handleChange} className="w-12 p-1" />
                                    <Input name="accent_color" value={formData.accent_color || ""} onChange={handleChange} className="flex-1" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Corner Radius</label>
                            <select name="border_radius" value={formData.border_radius || "0.5rem"} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm">
                                <option value="0rem">Sharp</option>
                                <option value="0.25rem">Small</option>
                                <option value="0.5rem">Medium</option>
                                <option value="1rem">Large</option>
                                <option value="9999px">Pill</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Font Family</label>
                            <select name="heading_font" value={formData.heading_font || "Inter"} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm">
                                <option value="Inter">Inter (Default)</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Nunito">Nunito</option>
                                <option value="Arial">Arial</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Live Preview Container */}
                <section className="mt-8 border border-foreground/10 rounded-xl p-4 md:p-6 bg-slate-50 overflow-hidden relative">
                    <div className="absolute top-2 left-3 text-[10px] font-bold text-foreground/40 uppercase">Live Element Preview</div>
                    <div className="mt-4 flex flex-col gap-6" style={{
                        "--primary": formData.primary_color,
                        "--accent": formData.accent_color,
                        "--radius": formData.border_radius,
                        fontFamily: formData.heading_font
                    } as React.CSSProperties}>
                        {/* Preview Navigation */}
                        <div className="flex items-center justify-between p-4 bg-white shadow-sm border border-black/5" style={{ borderRadius: formData.border_radius }}>
                            <div className="flex items-center gap-2">
                                {formData.logo_url ? (
                                    <img src={formData.logo_url} alt="Logo" className="h-8 max-w-[100px] object-contain" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: formData.primary_color }}>M</div>
                                )}
                                <span className="font-bold text-lg">{formData.site_name || "Masjid Portal"}</span>
                            </div>
                            <div className="px-4 py-1.5 text-xs font-semibold text-white cursor-pointer" style={{ backgroundColor: formData.primary_color, borderRadius: formData.border_radius }}>
                                Donate
                            </div>
                        </div>

                        {/* Preview Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white shadow-sm border border-black/5 flex flex-col" style={{ borderRadius: formData.border_radius }}>
                                <h4 className="font-bold text-sm mb-1" style={{ color: formData.primary_color }}>Upcoming Event</h4>
                                <p className="text-xs text-black/60 mb-3">Community Iftar this friday.</p>
                                <div className="mt-auto px-3 py-1.5 text-xs text-center font-bold" style={{ backgroundColor: formData.accent_color, color: '#fff', borderRadius: formData.border_radius }}>
                                    RSVP Now
                                </div>
                            </div>
                            <div className="p-4 bg-white shadow-sm border border-black/5" style={{ borderRadius: formData.border_radius }}>
                                <h4 className="font-bold text-sm mb-1 text-black/80">Statistics</h4>
                                <p className="text-2xl font-bold" style={{ color: formData.primary_color }}>320</p>
                                <p className="text-[10px] text-black/50">Active Members</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-black/5">
                    <Button disabled={isSaving} type="submit" className="min-w-[140px] shadow-md" style={{ backgroundColor: formData.primary_color, borderRadius: formData.border_radius, color: '#fff' }}>
                        {isSaving ? "Saving..." : "Save Branding"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
