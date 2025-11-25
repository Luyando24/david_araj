'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '@/lib/gallery-data';

type Category = 'all' | 'action' | 'training' | 'benfica' | 'lifestyle' | 'youth';

export default function PhotoGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const categories = [
        { id: 'all' as Category, label: 'All Photos' },
        { id: 'action' as Category, label: 'Match Action' },
        { id: 'training' as Category, label: 'Training' },
        { id: 'benfica' as Category, label: 'Benfica' },
        { id: 'lifestyle' as Category, label: 'Lifestyle' },
        { id: 'youth' as Category, label: 'Youth / Early Career' },
    ];

    const filteredPhotos = selectedCategory === 'all'
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter(photo => photo.category === selectedCategory);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const nextPhoto = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
        }
    };

    const prevPhoto = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Photo Gallery
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Capturing moments from matches, training, and life at Benfica Academy
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

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {filteredPhotos.map((photo, index) => (
                            <div
                                key={photo.id}
                                onClick={() => openLightbox(index)}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-4">
                                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {photo.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 text-gray-400">
                        Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
                    </div>
                </div>
            </main>

            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-benfica-red transition-colors p-2"
                        aria-label="Close lightbox"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={prevPhoto}
                        className="absolute left-4 text-white hover:text-benfica-red transition-colors p-2"
                        aria-label="Previous photo"
                    >
                        <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12" />
                    </button>

                    <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
                        <Image
                            src={filteredPhotos[lightboxIndex].url}
                            alt={filteredPhotos[lightboxIndex].title}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>

                    <button
                        onClick={nextPhoto}
                        className="absolute right-4 text-white hover:text-benfica-red transition-colors p-2"
                        aria-label="Next photo"
                    >
                        <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12" />
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                        <p className="text-lg font-semibold mb-1">{filteredPhotos[lightboxIndex].title}</p>
                        <p className="text-sm text-gray-400">
                            {lightboxIndex + 1} / {filteredPhotos.length}
                        </p>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
