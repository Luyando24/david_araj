'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/app/actions/upload-action';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function PhotosManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    async function fetchPhotos() {
        try {
            const { data, error } = await supabase
                .from('gallery_photos')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setPhotos(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddPhoto = () => {
        const newPhoto = {
            id: `temp-${Date.now()}`,
            url: '',
            label: '',
            category: 'Match Action',
            display_order: photos.length
        };
        setPhotos([...photos, newPhoto]);
    };

    const handleRemovePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const updatePhoto = (id: string, field: string, value: any) => {
        setPhotos(photos.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const { url } = await uploadImage(formData);
            updatePhoto(id, 'url', url);
            setSuccess('Image uploaded successfully!');
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError('Upload failed. Ensure you have created a "gallery" bucket in Supabase Storage with public access.');
        } finally {
            setUploading(false);
        }
    };

    async function handleSave() {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Filter out empty ones and temporary IDs
            const dataToSave = photos
                .filter(p => p.url.trim() !== '')
                .map((p, index) => ({
                    url: p.url,
                    label: p.label,
                    category: p.category,
                    display_order: index
                }));

            // Delete existing
            const { error: deleteError } = await supabase
                .from('gallery_photos')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            if (deleteError) throw deleteError;

            // Insert new
            if (dataToSave.length > 0) {
                const { error: insertError } = await supabase
                    .from('gallery_photos')
                    .insert(dataToSave);
                if (insertError) throw insertError;
            }

            setSuccess('Gallery photos updated successfully!');
            fetchPhotos(); // Refresh with real IDs
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
            <div className="flex min-h-screen bg-black text-white">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow-red">Photo Gallery</h1>
                                <p className="text-gray-400">Manage your portfolio images at professional quality</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddPhoto}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all border border-gray-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New Photo
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || uploading}
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
                                <button onClick={() => setSuccess(null)} className="ml-auto text-green-500/50 hover:text-green-500"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-slide-in">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                                <button onClick={() => setError(null)} className="ml-auto text-red-500/50 hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {photos.map((photo, index) => (
                                <div key={photo.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-5 group hover:border-benfica-red/50 transition-all duration-300 relative overflow-hidden">
                                     {/* Background Glow */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-benfica-red/5 rounded-full blur-3xl group-hover:bg-benfica-red/10 transition-all"></div>
                                    
                                    <div className="relative aspect-square rounded-xl bg-black mb-4 overflow-hidden group-hover:shadow-2xl group-hover:shadow-red-500/10 ring-1 ring-white/5">
                                        {photo.url ? (
                                            <>
                                                <Image
                                                    src={photo.url}
                                                    alt={photo.label || 'Gallery Image'}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    unoptimized // Since URLs could be external or from storage
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => updatePhoto(photo.id, 'url', '')}
                                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                                <ImageIcon className="w-12 h-12 text-gray-800 mb-3" />
                                                <p className="text-gray-500 text-sm mb-4">No image uploaded</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id={`file-${photo.id}`}
                                                    onChange={(e) => handleFileUpload(e, photo.id)}
                                                    disabled={uploading}
                                                />
                                                <label
                                                    htmlFor={`file-${photo.id}`}
                                                    className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all border border-gray-700 shadow-lg"
                                                >
                                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                    Choose File
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Caption / Label</label>
                                            <input
                                                type="text"
                                                value={photo.label}
                                                onChange={(e) => updatePhoto(photo.id, 'label', e.target.value)}
                                                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-700"
                                                placeholder="e.g. SL Benfica training session"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Category</label>
                                                <div className="relative">
                                                    <select
                                                        value={photo.category}
                                                        onChange={(e) => updatePhoto(photo.id, 'category', e.target.value)}
                                                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-benfica-red outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option>Match Action</option>
                                                        <option>Training</option>
                                                        <option>Personal</option>
                                                        <option>Achievements</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Order</label>
                                                <div className="bg-black border border-gray-800 rounded-lg p-2.5 text-sm text-gray-400 text-center font-mono">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemovePhoto(photo.id)}
                                            className="w-full py-2.5 text-gray-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-500/20 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {photos.length === 0 && (
                            <div className="py-32 text-center bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                                <ImageIcon className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-500">No photos in your gallery</h2>
                                <p className="text-gray-600 mt-2 max-w-xs mx-auto text-sm">Start building your professional portfolio by adding and uploading your best shots.</p>
                                <button
                                    onClick={handleAddPhoto}
                                    className="mt-8 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl border border-white/10 transition-all font-bold"
                                >
                                    Add your first photo
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
