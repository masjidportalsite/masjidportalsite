/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type BrandingSettings = {
    id?: string;
    organization_id?: string;
    site_name?: string;
    logo_url?: string;
    secondary_logo_url?: string;
    footer_logo_url?: string;
    login_logo_url?: string;
    favicon_url?: string;
    social_share_image?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    background_color?: string;
    text_color?: string;
    heading_font?: string;
    body_font?: string;
    font_size_scale?: number;
    border_radius?: string;
    shadow_intensity?: string;
    sidebar_style?: string;
    header_style?: string;
    card_style?: string;
    navigation_style?: string;
    template_name?: string;
    custom_css?: string;
    custom_announcement?: string;
    sponsor_logo_url?: string;
};

type BrandingContextType = {
    settings: BrandingSettings | null;
    isLoading: boolean;
    updateSettings: (newSettings: Partial<BrandingSettings>) => void;
    refreshSettings: () => Promise<void>;
};

const BrandingContext = createContext<BrandingContextType>({
    settings: null,
    isLoading: true,
    updateSettings: () => { },
    refreshSettings: async () => { },
});

export const useBranding = () => useContext(BrandingContext);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<BrandingSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applyFavicon = (url?: string) => {
        if (!url) return;
        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    const fetchSettings = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/branding");
            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    setSettings(data.data);
                    applyFavicon(data.data.favicon_url);
                }
            }
        } catch (error) {
            console.error("Failed to fetch branding:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = (newSettings: Partial<BrandingSettings>) => {
        setSettings((prev) => {
            const merged = { ...prev, ...newSettings };
            if (merged.favicon_url && merged.favicon_url !== prev?.favicon_url) {
                applyFavicon(merged.favicon_url);
            }
            return merged;
        });
    };

    // Convert settings into CSS Variables dynamically
    const cssVariables = settings
        ? `
    :root {
      --primary: ${settings.primary_color || "#10b981"};
      --secondary: ${settings.secondary_color || "#059669"};
      --accent: ${settings.accent_color || "#3b82f6"};
      --background: ${settings.background_color || "#ffffff"};
      --foreground: ${settings.text_color || "#171717"};
      --font-body: ${settings.body_font || "Inter"}, sans-serif;
      --font-heading: ${settings.heading_font || "Inter"}, sans-serif;
      --radius: ${settings.border_radius || "0.5rem"};
    }
    ${settings.custom_css || ""}
  `
        : "";

    return (
        <BrandingContext.Provider value={{ settings, isLoading, updateSettings, refreshSettings: fetchSettings }}>
            {settings && (
                <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
            )}
            {/* Fallback while loading, but keeping children rendered so we avoid blocking hydration in dashboard */}
            {children}
        </BrandingContext.Provider>
    );
}
