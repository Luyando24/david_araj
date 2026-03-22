'use client';

import { useState, useEffect } from 'react';
import { getPlayerDetails, getCareerHighlights, getPlayerStats, getTestimonials } from '../supabase';
import { PLAYER_INFO, CAREER_HIGHLIGHTS, TECHNICAL_STATS, PHYSICAL_STATS, TESTIMONIAL, PLAYER_SUMMARY, CHARACTER_DATA } from '../constants';

export function usePortfolioData() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [player, highlights, stats, testimonials] = await Promise.all([
                    getPlayerDetails(),
                    getCareerHighlights(),
                    getPlayerStats(),
                    getTestimonials()
                ]);

                // Map stats back to categories
                const technicalStats = stats.filter((s: any) => s.category === 'technical' || s.category === 'cognitive');
                const physicalStats = stats.filter((s: any) => s.category === 'physical');

                setData({
                    playerInfo: player ? {
                        fullName: player.full_name,
                        age: player.age,
                        height: player.height,
                        weight: player.weight,
                        nationality: player.nationality,
                        position: player.position,
                        footedness: player.footedness,
                        location: player.location,
                        tagline: player.tagline,
                        email: player.email,
                        phone: player.phone,
                        whatsapp: player.whatsapp,
                        instagram: player.instagram,
                        youtube: player.youtube,
                    } : PLAYER_INFO,
                    characterData: player ? {
                        trainingVolume: player.training_volume,
                        gpa: player.gpa,
                        attendance: player.attendance,
                        familyEnvironment: player.family_environment,
                    } : CHARACTER_DATA,
                    playerSummary: player?.summary || PLAYER_SUMMARY,
                    careerHighlights: highlights.length > 0 ? highlights.map((h: any) => ({
                        id: h.id,
                        title: h.title,
                        description: h.description,
                        details: h.details,
                        icon: h.icon,
                        year: h.year,
                    })) : CAREER_HIGHLIGHTS,
                    technicalStats: technicalStats.length > 0 ? technicalStats.map((s: any) => ({
                        label: s.label,
                        value: s.value,
                        category: s.category,
                    })) : TECHNICAL_STATS,
                    physicalStats: physicalStats.length > 0 ? physicalStats.map((s: any) => ({
                        label: s.label,
                        value: s.value,
                        category: s.category,
                    })) : PHYSICAL_STATS,
                    testimonial: testimonials.length > 0 ? {
                        text: testimonials[0].text,
                        coach: testimonials[0].coach,
                        title: testimonials[0].title,
                    } : TESTIMONIAL,
                });
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                // Fallback to constants
                setData({
                    playerInfo: PLAYER_INFO,
                    characterData: CHARACTER_DATA,
                    playerSummary: PLAYER_SUMMARY,
                    careerHighlights: CAREER_HIGHLIGHTS,
                    technicalStats: TECHNICAL_STATS,
                    physicalStats: PHYSICAL_STATS,
                    testimonial: TESTIMONIAL,
                });
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { ...data, loading };
}
