import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import StatCard from '@/components/ui/StatCard';
import { PLAYER_INFO, CAREER_HIGHLIGHTS, TECHNICAL_STATS } from '@/lib/constants';
import { Trophy, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Header />

            <main>
                {/* Hero Section */}
                <Hero
                    title="DAVID ARAJ"
                    subtitle={PLAYER_INFO.position}
                    tagline={PLAYER_INFO.tagline}
                    backgroundImage="/images/hero-bg.jpg"
                />

                {/* Quick Stats Section */}
                <section className="py-20 bg-gradient-to-b from-black to-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
                                Performance Highlights
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Technical excellence backed by data and European validation
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {TECHNICAL_STATS.slice(0, 6).map((stat, index) => (
                                <StatCard
                                    key={index}
                                    label={stat.label}
                                    value={stat.value}
                                    category={stat.category}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/stats"
                                className="inline-block text-benfica-gold hover:text-benfica-red font-semibold transition-colors"
                            >
                                View All Stats & Metrics →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Career Highlights Preview */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
                                Career Milestones
                            </h2>
                            <p className="text-gray-400 text-lg">
                                From early MLS recognition to European validation
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {CAREER_HIGHLIGHTS.map((highlight) => (
                                <div
                                    key={highlight.id}
                                    className="bg-gradient-to-br from-gray-800 to-black rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105"
                                >
                                    <div className="text-6xl mb-4">{highlight.icon}</div>
                                    <div className="text-benfica-gold text-sm font-semibold mb-2 uppercase tracking-wide">
                                        {highlight.year}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-benfica-red transition-colors">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-300 mb-4">{highlight.description}</p>
                                    <ul className="space-y-2">
                                        {highlight.details.slice(0, 2).map((detail, idx) => (
                                            <li key={idx} className="text-gray-400 text-sm flex items-start">
                                                <span className="text-benfica-red mr-2">▪</span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/highlights"
                                className="inline-block text-benfica-gold hover:text-benfica-red font-semibold transition-colors"
                            >
                                View Complete Career Timeline →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Preview */}
                <section className="py-20 bg-black">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="group">
                                    <Trophy className="w-12 h-12 text-benfica-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                                        {PLAYER_INFO.age}
                                    </h3>
                                    <p className="text-gray-400">Years Old</p>
                                </div>

                                <div className="group">
                                    <Target className="w-12 h-12 text-benfica-red mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-3xl font-display font-bold text-white mb-2">No.10</h3>
                                    <p className="text-gray-400">Attacking Midfielder</p>
                                </div>

                                <div className="group">
                                    <Zap className="w-12 h-12 text-benfica-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                                        Dual
                                    </h3>
                                    <p className="text-gray-400">American / Jordanian</p>
                                </div>
                            </div>

                            <div className="text-center mt-12">
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center space-x-2 bg-benfica-red text-white px-8 py-4 rounded-lg font-display font-semibold uppercase tracking-wide hover:bg-red-700 transition-all"
                                >
                                    <span>View Full Profile</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
