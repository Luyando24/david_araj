'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPlayerInfoPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchPlayerInfo();
    }, []);

    async function fetchPlayerInfo() {
        try {
            const { data: player, error } = await supabase
                .from('player_details')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                throw error;
            }

            setData(player || {});
        } catch (err: any) {
            console.error('Error fetching player info:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('player_details')
                .upsert({
                    ...data,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Error saving player info:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev: any) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-black items-center justify-center">
                <Loader2 className="w-8 h-8 text-benfica-red animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Player Information</h1>
                                <p className="text-gray-400">Manage basic bio, character, and contact details</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Success/Error Alerts */}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Changes saved successfully!</span>
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={data?.full_name || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={data?.age || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Height</label>
                                        <input
                                            type="text"
                                            name="height"
                                            value={data?.height || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Weight</label>
                                        <input
                                            type="text"
                                            name="weight"
                                            value={data?.weight || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
                                        <input
                                            type="text"
                                            name="position"
                                            value={data?.position || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={data?.location || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={data?.tagline || ''}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Summary</label>
                                    <textarea
                                        name="summary"
                                        value={data?.summary || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            {/* Character & Academic */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-bold text-white mb-6">Character & Academic</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Training Volume</label>
                                        <input
                                            type="text"
                                            name="training_volume"
                                            value={data?.training_volume || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">GPA</label>
                                        <input
                                            type="text"
                                            name="gpa"
                                            value={data?.gpa || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Attendance</label>
                                        <input
                                            type="text"
                                            name="attendance"
                                            value={data?.attendance || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Family Environment</label>
                                        <input
                                            type="text"
                                            name="family_environment"
                                            value={data?.family_environment || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Links */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-bold text-white mb-6">Contact & Socials</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data?.email || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone/WhatsApp</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={data?.phone || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Instagram URL</label>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={data?.instagram || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">YouTube URL</label>
                                        <input
                                            type="text"
                                            name="youtube"
                                            value={data?.youtube || ''}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-benfica-red focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-benfica-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    <span>Save All Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
