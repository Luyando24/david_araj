import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PLAYER_INFO } from '@/lib/constants';
import { User, MapPin, Flag, Ruler, Weight, Footprints } from 'lucide-react';

export default function ProfilePage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 animate-fade-in">
                        <Breadcrumb />
                    </div>

                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Player Profile
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Complete athletic and personal information
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-6 animate-slide-up">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-2xl font-display font-bold text-benfica-red mb-6 flex items-center">
                                    <User className="w-6 h-6 mr-3" />
                                    Basic Information
                                </h2>

                                <div className="space-y-6">
                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Full Name</div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.fullName}</div>
                                    </div>

                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Age</div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.age} years old</div>
                                    </div>

                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1 flex items-center">
                                            <Flag className="w-4 h-4 mr-2" />
                                            Nationality
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.nationality.join(' / ')}</div>
                                    </div>

                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Current Location
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.location}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Position</div>
                                        <div className="text-benfica-gold text-2xl font-display font-bold">{PLAYER_INFO.position}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Physical Attributes */}
                        <div className="space-y-6 animate-slide-up">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-2xl font-display font-bold text-benfica-red mb-6 flex items-center">
                                    <Ruler className="w-6 h-6 mr-3" />
                                    Physical Attributes
                                </h2>

                                <div className="space-y-6">
                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1 flex items-center">
                                            <Ruler className="w-4 h-4 mr-2" />
                                            Height
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.height}</div>
                                    </div>

                                    <div className="border-b border-gray-700 pb-4">
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1 flex items-center">
                                            <Weight className="w-4 h-4 mr-2" />
                                            Weight
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.weight}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-400 text-sm uppercase tracking-wide mb-1 flex items-center">
                                            <Footprints className="w-4 h-4 mr-2" />
                                            Footedness
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.footedness}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Player Tagline Card */}
                            <div className="bg-gradient-to-r from-benfica-red to-red-700 rounded-2xl p-8 shadow-2xl">
                                <blockquote className="text-white text-xl sm:text-2xl font-light italic leading-relaxed">
                                    &ldquo;{PLAYER_INFO.tagline}&rdquo;
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="max-w-7xl mx-auto mt-12 animate-slide-up">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 sm:p-12 shadow-2xl">
                            <h2 className="text-3xl font-display font-bold text-benfica-gold mb-6">
                                Player Bio
                            </h2>
                            <div className="text-gray-300 text-lg leading-relaxed space-y-4">
                                <p>
                                    David Fahd Araj is a{' '}
                                    <span className="text-white font-semibold">{PLAYER_INFO.age}-year-old attacking midfielder</span>{' '}
                                    with American nationality, currently based in{' '}
                                    <span className="text-white font-semibold">{PLAYER_INFO.location}</span>.
                                </p>
                                <p>
                                    Playing as a <span className="text-benfica-gold font-semibold">No.10</span>, David combines{' '}
                                    <span className="text-white font-semibold">technical excellence with creative vision</span>,
                                    operating comfortably with both feet. His journey includes early recognition by{' '}
                                    <span className="text-white font-semibold">D.C. United at age 12</span> after completing their
                                    four-month Gifted & Talented program, and subsequent validation through selection to{' '}
                                    <span className="text-benfica-red font-semibold">Benfica Academy&apos;s prestigious residency program</span>.
                                </p>
                                <p>
                                    David&apos;s skill set features{' '}
                                    <span className="text-white font-semibold">
                                        exceptional ball control, unpredictability in the final third, and the ability to finish
                                        with both feet
                                    </span>
                                    . His playing style emphasizes quick decision-making, progressive play, and creative
                                    chance creation – qualities that have earned him top evaluations from European academy coaches.
                                </p>
                                <p className="text-white font-semibold italic border-l-4 border-benfica-red pl-4 mt-6">
                                    A creative, high-IQ No.10 with early D.C. United identification, strong European validation,
                                    and a high developmental ceiling suited for MLS academy integration.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Character & Academic Excellence */}
                    <div className="max-w-7xl mx-auto mt-12 animate-slide-up">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 sm:p-12 shadow-2xl">
                            <h2 className="text-3xl font-display font-bold text-benfica-gold mb-8">
                                Character & Academic Excellence
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-black/30 rounded-xl p-6 text-center border border-benfica-red/20">
                                    <div className="text-4xl font-display font-bold text-benfica-red mb-2">18</div>
                                    <div className="text-gray-400 text-sm uppercase tracking-wide">Hours/Week Training</div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-6 text-center border border-benfica-gold/20">
                                    <div className="text-4xl font-display font-bold text-benfica-gold mb-2">3.58</div>
                                    <div className="text-gray-400 text-sm uppercase tracking-wide">Academic GPA</div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-6 text-center border border-green-500/20">
                                    <div className="text-4xl font-display font-bold text-green-500 mb-2">0</div>
                                    <div className="text-gray-400 text-sm uppercase tracking-wide">Unexcused Absences</div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-6 flex items-center justify-center border border-blue-500/20">
                                    <div className="text-center">
                                        <div className="text-blue-500 text-2xl font-display font-bold mb-2">✓</div>
                                        <div className="text-gray-400 text-sm uppercase tracking-wide">Stable Family Environment</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-gray-300 text-center">
                                <p className="text-lg">
                                    Demonstrating <span className="text-white font-semibold">exceptional commitment</span> both on and off the field,
                                    with a <span className="text-white font-semibold">balanced approach</span> to athletic and academic excellence.
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
