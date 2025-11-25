'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GALLERY_VIDEOS } from '@/lib/gallery-data';
import { Play } from 'lucide-react';

type Category = 'all' | 'highlights' | 'training' | 'drills' | 'tactical';

export default function VideoGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);

    const categories = [
        { id: 'all' as Category, label: 'All Videos' },
        { id: 'highlights' as Category, label: 'Match Highlights' },
        { id: 'training' as Category, label: 'Training Sessions' },
        { id: 'drills' as Category, label: 'Skills & Drills' },
        { id: 'tactical' as Category, label: 'Tactical Play' },
    ];

    const filteredVideos = selectedCategory === 'all'
        ? GALLERY_VIDEOS
        : GALLERY_VIDEOS.filter(video => video.category === selectedCategory);

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Video Gallery
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Match highlights, training sessions, and tactical gameplay
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === cat.id
                                        ? 'bg-benfica-red text-white shadow-lg scale-105'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {filteredVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-benfica-red/30 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative aspect-video bg-black">
                                    {playingVideo === video.id ? (
                                        <video
                                            controls
                                            autoPlay
                                            className="w-full h-full"
                                            onEnded={() => setPlayingVideo(null)}
                                        >
                                            <source src={video.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <button
                                            onClick={() => setPlayingVideo(video.id)}
                                            className="absolute inset-0 flex items-center justify-center group"
                                        >
                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all"></div>
                                            <div className="relative z-10 w-20 h-20 bg-benfica-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                                <Play className="w-10 h-10 text-white ml-1" fill="white" />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="text-white text-center px-4">
                                                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Click to play
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-benfica-gold text-xs uppercase tracking-wide font-semibold">
                                            {video.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 text-gray-400">
                        Showing {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
