'use client';

import Image from 'next/image';
import CTAButton from './CTAButton';
import { Download, Play, Mail } from 'lucide-react';

interface HeroProps {
    title: string;
    subtitle: string;
    tagline: string;
    backgroundImage?: string;
}

export default function Hero({
    title,
    subtitle,
    tagline,
    backgroundImage = '/images/hero-bg.jpg',
}: HeroProps) {
    const handleDownloadPDF = () => {
        window.open('/api/download-pdf', '_blank');
    };

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-benfica-red/30 z-10"></div>
                <Image
                    src={backgroundImage}
                    alt="David Araj"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                    {/* Subtitle */}
                    <div className="text-benfica-gold uppercase tracking-widest text-sm sm:text-base font-semibold mb-4 animate-slide-up">
                        {subtitle}
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight animate-slide-up">
                        {title}
                    </h1>

                    {/* Tagline */}
                    <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light max-w-3xl mx-auto animate-slide-up">
                        {tagline}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 animate-slide-up">
                        <CTAButton
                            onClick={handleDownloadPDF}
                            variant="primary"
                            Icon={Download}
                        >
                            Download Player PDF
                        </CTAButton>

                        <CTAButton
                            href="/videos"
                            variant="secondary"
                            Icon={Play}
                        >
                            Watch Highlights
                        </CTAButton>

                        <CTAButton
                            href="/contact"
                            variant="outline"
                            Icon={Mail}
                        >
                            Contact for Trials
                        </CTAButton>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                </div>
            </div>
        </section>
    );
}
