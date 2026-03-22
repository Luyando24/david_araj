'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminHighlightsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [highlights, setHighlights] = useState<any[]>([]);

    useEffect(() => {
        fetchHighlights();
    }, []);

    async function fetchHighlights() {
        try {
            const { data, error } = await supabase
                .from('career_highlights')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setHighlights(data || []);
        } catch (err: any) {
            console.error('Error fetching highlights:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Delete all and re-insert for simplicity in this demo
            // In a real app, you'd handle updates/inserts/deletes properly
            const { error: deleteError } = await supabase
                .from('career_highlights')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000');

            if (deleteError) throw deleteError;

            const { error: insertError } = await supabase
                .from('career_highlights')
                .insert(highlights.map((h, i) => ({
                    title: h.title,
                    description: h.description,
                    details: h.details,
                    icon: h.icon,
                    year: h.year,
                    display_order: i
                })));

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchHighlights(); // Refresh to get proper IDs
        } catch (err: any) {
            console.error('Error saving highlights:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const addHighlight = () => {
        setHighlights([...highlights, {
            title: '',
            description: '',
            details: [],
            icon: '⚽',
            year: '',
            display_order: highlights.length
        }]);
    };

    const removeHighlight = (index: number) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    const updateHighlight = (index: number, field: string, value: any) => {
        const newHighlights = [...highlights];
        newHighlights[index] = { ...newHighlights[index], [field]: value };
        setHighlights(newHighlights);
    };

    const updateDetail = (highlightIndex: number, detailIndex: number, value: string) => {
        const newHighlights = [...highlights];
        const newDetails = [...newHighlights[highlightIndex].details];
        newDetails[detailIndex] = value;
        newHighlights[highlightIndex].details = newDetails;
        setHighlights(newHighlights);
    };

    const addDetail = (highlightIndex: number) => {
        const newHighlights = [...highlights];
        newHighlights[highlightIndex].details = [...newHighlights[highlightIndex].details, ''];
        setHighlights(newHighlights);
    };

    const removeDetail = (highlightIndex: number, detailIndex: number) => {
        const newHighlights = [...highlights];
        newHighlights[highlightIndex].details = newHighlights[highlightIndex].details.filter((_: any, i: number) => i !== detailIndex);
        setHighlights(newHighlights);
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
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Career Highlights</h1>
                                <p className="text-gray-400">Manage milestones and key achievements</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={addHighlight}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Milestone</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-benfica-red hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>Save All</span>
                                </button>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Changes saved successfully!</span>
                            </div>
                        )}
                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative group">
                                    <button
                                        onClick={() => removeHighlight(index)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Year/Age</label>
                                            <input
                                                type="text"
                                                value={highlight.year}
                                                onChange={(e) => updateHighlight(index, 'year', e.target.value)}
                                                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none"
                                                placeholder="e.g. 2024"
                                            />
                                            <label className="block text-sm font-medium text-gray-400 mt-4 mb-2">Icon</label>
                                            <input
                                                type="text"
                                                value={highlight.icon}
                                                onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                                                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none text-2xl"
                                                placeholder="⚽"
                                            />
                                        </div>

                                        <div className="md:col-span-10">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={highlight.title}
                                                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none font-bold"
                                                    placeholder="Milestone Title"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Short Description</label>
                                                <input
                                                    type="text"
                                                    value={highlight.description}
                                                    onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none"
                                                    placeholder="Brief overview"
                                                />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-medium text-gray-400">Bullet Details</label>
                                                    <button
                                                        onClick={() => addDetail(index)}
                                                        className="text-xs text-benfica-gold hover:text-benfica-red transition-colors"
                                                    >
                                                        + Add Detail
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {highlight.details?.map((detail: string, dIdx: number) => (
                                                        <div key={dIdx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={detail}
                                                                onChange={(e) => updateDetail(index, dIdx, e.target.value)}
                                                                className="flex-1 bg-black border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-benfica-red outline-none"
                                                                placeholder="Specific detail item"
                                                            />
                                                            <button
                                                                onClick={() => removeDetail(index, dIdx)}
                                                                className="text-gray-500 hover:text-red-500"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {highlights.length === 0 && (
                                <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                                    <p className="text-gray-500">No milestones added yet.</p>
                                    <button
                                        onClick={addHighlight}
                                        className="mt-4 text-benfica-gold hover:underline"
                                    >
                                        Add your first highlight
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
