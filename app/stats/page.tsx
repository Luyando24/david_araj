import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/ui/StatCard';
import { TECHNICAL_STATS, PHYSICAL_STATS } from '@/lib/constants';
import { Activity, Zap, TrendingUp } from 'lucide-react';

export default function StatsPage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Stats & Metrics
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Performance data showcasing technical excellence and physical attributes
                        </p>
                    </div>

                    {/* Technical & Cognitive Metrics */}
                    <div className="mb-20">
                        <div className="flex items-center justify-center mb-10">
                            <Zap className="w-8 h-8 text-benfica-red mr-3" />
                            <h2 className="text-4xl font-display font-bold text-white">
                                Technical & Cognitive Metrics
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slide-up">
                            {TECHNICAL_STATS.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    label={stat.label}
                                    value={stat.value}
                                    category={stat.category}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Physical Data */}
                    <div className="mb-20">
                        <div className="flex items-center justify-center mb-10">
                            <Activity className="w-8 h-8 text-benfica-gold mr-3" />
                            <h2 className="text-4xl font-display font-bold text-white">
                                Physical Data
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slide-up">
                            {PHYSICAL_STATS.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    label={stat.label}
                                    value={stat.value}
                                    category={stat.category}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Performance Notes */}
                    <div className="max-w-4xl mx-auto animate-slide-up">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 sm:p-12 shadow-2xl">
                            <div className="flex items-center mb-6">
                                <TrendingUp className="w-8 h-8 text-benfica-red mr-3" />
                                <h3 className="text-2xl font-display font-bold text-white">
                                    Performance Notes
                                </h3>
                            </div>

                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    <span className="text-white font-semibold">Pass completion under pressure (82%)</span>{' '}
                                    demonstrates exceptional composure in tight situations, a crucial attribute for a creative midfielder
                                    operating in congested areas.
                                </p>

                                <p>
                                    With <span className="text-white font-semibold">3.1 key passes per match</span> and an{' '}
                                    <span className="text-white font-semibold">xA (expected assists) of 0.32</span>, David consistently
                                    creates high-quality scoring opportunities for teammates.
                                </p>

                                <p>
                                    <span className="text-white font-semibold">First-touch success rate of 88%</span> highlights technical
                                    proficiency, allowing him to receive the ball cleanly and transition quickly into progressive actions.
                                </p>

                                <p>
                                    <span className="text-white font-semibold">Speed of play (0.9 seconds)</span> reflects quick decision-making
                                    and awareness, essential for a modern No.10 operating at the highest levels.
                                </p>

                                <p className="text-benfica-gold font-semibold pt-4">
                                    Additional strength and power metrics (CMJ, vertical jump) are available upon request for serious inquiries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
