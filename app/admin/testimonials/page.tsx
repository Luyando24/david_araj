'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminTestimonialsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [testimonials, setTestimonials] = useState<any[]>([]);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    async function fetchTestimonials() {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (err: any) {
            console.error('Error fetching testimonials:', err);
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
            await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            const { error: insertError } = await supabase
                .from('testimonials')
                .insert(testimonials.map((t, i) => ({
                    text: t.text,
                    coach: t.coach,
                    title: t.title,
                    display_order: i
                })));

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchTestimonials();
        } catch (err: any) {
            console.error('Error saving testimonials:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const addTestimonial = () => {
        setTestimonials([...testimonials, {
            text: '',
            coach: '',
            title: '',
            display_order: testimonials.length
        }]);
    };

    const removeTestimonial = (index: number) => {
        setTestimonials(testimonials.filter((_, i) => i !== index));
    };

    const updateTestimonial = (index: number, field: string, value: string) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setTestimonials(newTestimonials);
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Testimonials</h1>
                                <p className="text-gray-400">Manage coach quotes and testimonials</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={addTestimonial}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Testimonial</span>
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
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative">
                                    <button
                                        onClick={() => removeTestimonial(index)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Quote Text</label>
                                            <textarea
                                                value={testimonial.text}
                                                onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                                                rows={4}
                                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:ring-benfica-red outline-none"
                                                placeholder="Enter the coach's testimonial here..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Coach Name</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.coach}
                                                    onChange={(e) => updateTestimonial(index, 'coach', e.target.value)}
                                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none"
                                                    placeholder="Coach Name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Coach Title</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.title}
                                                    onChange={(e) => updateTestimonial(index, 'title', e.target.value)}
                                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:ring-benfica-red outline-none"
                                                    placeholder="e.g. Benfica Academy Coach"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {testimonials.length === 0 && (
                                <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                                    <p className="text-gray-500">No testimonials added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
