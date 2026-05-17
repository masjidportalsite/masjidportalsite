"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Uses a spiritual, royalty-free ambient audio.
// Replace AUDIO_SRC with a locally hosted file (e.g. /audio/ambient.mp3) in production.
// This fallback uses a gentle atmospheric pad from Zapsplat-compatible open sources.
const AUDIO_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function AmbientAudio() {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [visible, setVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Create audio element on mount (not before)
    useEffect(() => {
        const audio = new Audio(AUDIO_SRC);
        audio.loop = true;
        audio.volume = 0.07;
        audioRef.current = audio;

        // Show the button after a short delay to not distract on first render
        const t = setTimeout(() => setVisible(true), 3000);
        return () => {
            clearTimeout(t);
            audio.pause();
            audio.src = '';
        };
    }, []);

    const handleToggle = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!hasInteracted) {
            // First interaction: start playing
            setHasInteracted(true);
            try {
                await audio.play();
                setPlaying(true);
            } catch {
                // Browser blocked autoplay — silently ignore
            }
            return;
        }

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            try {
                await audio.play();
                setPlaying(true);
            } catch {
                // Browser blocked — ignore
            }
        }
    };

    if (!visible) return null;

    return (
        <button
            onClick={handleToggle}
            aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 shadow-xl"
            style={{
                background: 'rgba(5, 10, 8, 0.65)',
                animation: 'fadeInUp 0.6s ease forwards',
            }}
        >
            {playing ? (
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            ) : (
                <VolumeX className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                {hasInteracted ? (playing ? 'Ambient' : 'Muted') : 'Ambient'}
            </span>
            {playing && (
                <span className="flex gap-0.5 items-end h-3">
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className="w-0.5 bg-[#D4AF37] rounded-full"
                            style={{
                                animation: `audioBar 1s ease-in-out infinite`,
                                animationDelay: `${i * 0.18}s`,
                                height: '6px',
                            }}
                        />
                    ))}
                </span>
            )}

            <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes audioBar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
        </button>
    );
}
