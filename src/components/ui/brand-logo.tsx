/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BrandLogoProps {
    /** 'full' = icon + wordmark, 'icon' = icon only */
    variant?: 'full' | 'icon';
    /** Controls the height of the logo */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Whether the logo is on a dark/emerald background */
    theme?: 'light' | 'dark';
    /** Wrap with a Link to home */
    linked?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { icon: 20, text: 'text-base' },
    md: { icon: 28, text: 'text-lg' },
    lg: { icon: 40, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-4xl' },
};

export function BrandLogo({
    variant = 'full',
    size = 'md',
    theme = 'light',
    linked = false,
    className = '',
}: BrandLogoProps) {
    const { icon: iconSize, text: textSize } = sizeMap[size];
    const textColor = theme === 'dark' ? 'text-brand-cream' : 'text-brand-emerald';
    const dotColor = theme === 'dark' ? 'text-brand-gold' : 'text-brand-gold';

    const logoContent = (
        <div className={`flex items-center gap-2.5 select-none ${className}`} style={{ minHeight: iconSize }}>
            {/* SVG Icon — inline for color control and zero network requests */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
            >
                {/* Outer arch body */}
                <path
                    d="M24 4 C12 4 4 13 4 24 L4 42 L44 42 L44 24 C44 13 36 4 24 4 Z"
                    fill={theme === 'dark' ? '#ffffff' : '#064E3B'}
                    opacity={theme === 'dark' ? 0.9 : 1}
                />
                {/* Inner arch recess */}
                <path
                    d="M24 10 C15.5 10 9.5 16 9.5 24 L9.5 36 L38.5 36 L38.5 24 C38.5 16 32.5 10 24 10 Z"
                    fill={theme === 'dark' ? 'rgba(255,255,255,0.15)' : '#0a7355'}
                />
                {/* Keyhole - Gold circle */}
                <circle cx="24" cy="22" r="5.5" fill="#D4AF37" />
                {/* Keyhole - Gold stem */}
                <rect x="20.5" y="25.5" width="7" height="8.5" rx="2" fill="#D4AF37" />
                {/* Crescent visible tip */}
                <circle cx="24" cy="4.5" r="3.8" fill="#D4AF37" />
                {/* Cut the crescent to make it crescent-shaped */}
                <circle cx="26" cy="3.2" r="2.8" fill={theme === 'dark' ? '#064E3B' : '#f8f9f6'} />
            </svg>

            {/* Wordmark — only rendered in 'full' variant */}
            {variant === 'full' && (
                <span className={`font-bold tracking-tight leading-none ${textSize} ${textColor}`}>
                    Masjid<span className={dotColor}>Portal</span>
                </span>
            )}
        </div>
    );

    if (linked) {
        return (
            <Link href="/" aria-label="MasjidPortal Home">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
}

export default BrandLogo;
