'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2, Video, Youtube, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';

export default function VideosManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        fetchVideos();
    }, []);

    async function fetchVideos() {
        try {
            const { data, error } = await supabase
                .from('gallery_videos')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setVideos(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const extractYoutubeId = (url: string) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    const handleAddVideo = () => {
        const newVideo = {
            id: `temp-${Date.now()}`,
            url: '',
            title: '',
            description: '',
            thumbnail: '',
            category: 'Match Highlights',
            display_order: videos.length
        };
        setVideos([...videos, newVideo]);
    };

    const handleRemoveVideo = (id: string) => {
        setVideos(videos.filter(v => v.id !== id));
    };

    const updateVideo = (id: string, field: string, value: any) => {
        let updatedVideos = videos.map(v => {
            if (v.id === id) {
                const updated = { ...v, [field]: value };
                
                // If URL changes, try to auto-generate thumbnail
                if (field === 'url') {
                    const ytId = extractYoutubeId(value);
                    if (ytId) {
                        updated.thumbnail = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                    }
                }
                return updated;
            }
            return v;
        });
        setVideos(updatedVideos);
    };

    async function handleSave() {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const dataToSave = videos
                .filter(v => v.url.trim() !== '')
                .map((v, index) => ({
                    url: v.url,
                    title: v.title,
                    description: v.description,
                    thumbnail: v.thumbnail,
                    category: v.category,
                    display_order: index
                }));

            // Delete existing
            const { error: deleteError } = await supabase
                .from('gallery_videos')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all matching

            if (deleteError) throw deleteError;

            // Insert new
            if (dataToSave.length > 0) {
                const { error: insertError } = await supabase
                    .from('gallery_videos')
                    .insert(dataToSave);
                if (insertError) throw insertError;
            }

            setSuccess('Gallery videos updated successfully!');
            fetchVideos();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-black items-center justify-center">
                <Loader2 className="w-8 h-8 text-benfica-red animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black text-white font-sans">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow-red">Video Portfolio</h1>
                                <p className="text-gray-400">Curate your match highlights and training drills</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddVideo}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all border border-gray-700 shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New Video
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-benfica-red hover:bg-red-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 animate-slide-in">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>{success}</span>
                                <button onClick={() => setSuccess(null)} className="ml-auto opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-slide-in">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                                <button onClick={() => setError(null)} className="ml-auto opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {videos.map((video, index) => {
                                const ytId = extractYoutubeId(video.url);
                                return (
                                    <div key={video.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 group hover:border-benfica-red/30 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-benfica-red/5 rounded-full blur-[100px] -z-10 group-hover:bg-benfica-red/10 transition-all"></div>
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            {/* Preview Column */}
                                            <div className="lg:col-span-1">
                                                <div className="relative aspect-video rounded-xl bg-black overflow-hidden ring-1 ring-white/10 shadow-2xl">
                                                    {video.thumbnail ? (
                                                        <>
                                                            <Image
                                                                src={video.thumbnail}
                                                                alt="Video Thumbnail"
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                                                <div className="w-12 h-12 bg-benfica-red rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                                    <Youtube className="w-6 h-6 text-white" />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                            <Video className="w-10 h-10 text-gray-800 mb-2" />
                                                            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">No URL provided</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex items-center justify-between px-1">
                                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-mono">Position: #{index + 1}</span>
                                                    {ytId && (
                                                        <a 
                                                            href={`https://youtube.com/watch?v=${ytId}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-benfica-red transition-colors"
                                                            title="Watch on YouTube"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Data Column */}
                                            <div className="lg:col-span-3 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">YouTube URL</label>
                                                            <div className="relative group/input">
                                                                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                                                <input
                                                                    type="text"
                                                                    value={video.url}
                                                                    onChange={(e) => updateVideo(video.id, 'url', e.target.value)}
                                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 pl-10 text-sm text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-800"
                                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Video Title</label>
                                                            <input
                                                                type="text"
                                                                value={video.title}
                                                                onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                                                                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-800"
                                                                placeholder="e.g. SL Benfica vs Sporting CP | Match Highlights"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                                                            <select
                                                                value={video.category}
                                                                onChange={(e) => updateVideo(video.id, 'category', e.target.value)}
                                                                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-benfica-red outline-none cursor-pointer appearance-none"
                                                            >
                                                                <option>Match Highlights</option>
                                                                <option>Training Drills</option>
                                                                <option>Interviews</option>
                                                                <option>Personal Doc</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Short Description</label>
                                                            <input
                                                                type="text"
                                                                value={video.description}
                                                                onChange={(e) => updateVideo(video.id, 'description', e.target.value)}
                                                                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-800"
                                                                placeholder="Brief context about this highlight..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-2">
                                                    <button
                                                        onClick={() => handleRemoveVideo(video.id)}
                                                        className="text-gray-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/5 group/del"
                                                    >
                                                        <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                                                        Remove From Portfolio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {videos.length === 0 && (
                            <div className="py-32 text-center bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                                <Video className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-500">No videos in your portfolio</h2>
                                <p className="text-gray-600 mt-2 max-w-sm mx-auto text-sm">Integrate your YouTube highlights directly into your portfolio with one click.</p>
                                <button
                                    onClick={handleAddVideo}
                                    className="mt-8 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl border border-white/10 transition-all font-bold uppercase text-xs tracking-widest"
                                >
                                    Add your first highlight
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
