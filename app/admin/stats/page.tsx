'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['technical', 'cognitive', 'physical'];

export default function AdminStatsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const { data, error } = await supabase
                .from('player_stats')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setStats(data || []);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
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
            // Clear and re-insert for simplicity
            await supabase.from('player_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            const { error: insertError } = await supabase
                .from('player_stats')
                .insert(stats.map((s, i) => ({
                    label: s.label,
                    value: s.value,
                    category: s.category,
                    display_order: i
                })));

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchStats();
        } catch (err: any) {
            console.error('Error saving stats:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const addStat = () => {
        setStats([...stats, {
            label: '',
            value: '',
            category: 'technical',
            display_order: stats.length
        }]);
    };

    const removeStat = (index: number) => {
        setStats(stats.filter((_, i) => i !== index));
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setStats(newStats);
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Technical & Physical Stats</h1>
                                <p className="text-gray-400">Manage player analytics and performance metrics</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={addStat}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Metric</span>
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

                        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800 text-gray-400 text-sm">
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Label</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Value</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {stats.map((stat, index) => (
                                        <tr key={index} className="hover:bg-gray-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:ring-1 focus:ring-benfica-red outline-none"
                                                    placeholder="Stat Label"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                                                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:ring-1 focus:ring-benfica-red outline-none"
                                                    placeholder="Value (e.g. 85%)"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={stat.category}
                                                    onChange={(e) => updateStat(index, 'category', e.target.value)}
                                                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:ring-1 focus:ring-benfica-red outline-none"
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => removeStat(index)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stats.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    No stats found. Click "Add Metric" to create one.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
