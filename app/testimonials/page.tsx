import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TestimonialBlock from '@/components/ui/TestimonialBlock';
import { TESTIMONIAL } from '@/lib/constants';
import { Quote, Award } from 'lucide-react';

export default function TestimonialsPage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <Quote className="w-16 h-16 text-benfica-red mx-auto mb-6" />
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Coach Testimonials
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Professional assessments from elite academy coaches
                        </p>
                    </div>

                    {/* Featured Testimonial */}
                    <div className="max-w-5xl mx-auto mb-16 animate-slide-up">
                        <div className="mb-6 flex items-center justify-center">
                            <Award className="w-6 h-6 text-benfica-gold mr-2" />
                            <span className="text-benfica-gold font-semibold uppercase tracking-wide">
                                Featured Evaluation
                            </span>
                        </div>

                        <TestimonialBlock
                            text={TESTIMONIAL.text}
                            coach={TESTIMONIAL.coach}
                            title={TESTIMONIAL.title}
                        />
                    </div>

                    {/* Key Attributes Highlighted */}
                    <div className="max-w-5xl mx-auto animate-slide-up">
                        <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
                            Key Attributes Recognized
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Technical Excellence',
                                    description: 'Excellent relationship with the ball and strong skill set',
                                    color: 'from-benfica-red to-red-700',
                                },
                                {
                                    title: 'Unpredictability',
                                    description: 'Creative and unpredictable in the attacking third',
                                    color: 'from-benfica-gold to-yellow-600',
                                },
                                {
                                    title: 'Finishing Ability',
                                    description: 'Can finish easily with both feet',
                                    color: 'from-blue-600 to-blue-800',
                                },
                                {
                                    title: 'Progression',
                                    description: 'Strong capacity for short and medium passing',
                                    color: 'from-purple-600 to-purple-800',
                                },
                                {
                                    title: 'Character',
                                    description: 'All-around good kid with strong values',
                                    color: 'from-green-600 to-green-800',
                                },
                                {
                                    title: 'Enormous Potential',
                                    description: 'Recognized high ceiling for development',
                                    color: 'from-orange-600 to-orange-800',
                                },
                            ].map((attribute, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${attribute.color} opacity-90`}></div>

                                    <div className="relative z-10">
                                        <h3 className="text-xl font-display font-bold text-white mb-2">
                                            {attribute.title}
                                        </h3>
                                        <p className="text-white/90 text-sm">
                                            {attribute.description}
                                        </p>
                                    </div>

                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="max-w-3xl mx-auto mt-16 text-center animate-slide-up">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                            <p className="text-gray-300 text-lg mb-6">
                                Interested in learning more about David&apos;s playing style and performance metrics?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/stats"
                                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-benfica-red text-white rounded-lg font-display font-semibold uppercase tracking-wide hover:bg-red-700 transition-all"
                                >
                                    <span>View Full Stats</span>
                                    <span>→</span>
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-benfica-gold text-benfica-gold rounded-lg font-display font-semibold uppercase tracking-wide hover:bg-benfica-gold hover:text-black transition-all"
                                >
                                    <span>Contact Us</span>
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
