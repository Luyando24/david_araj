'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StatsManagement() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

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
            setMessage({ type: 'error', text: 'Failed to load stats' });
        } finally {
            setLoading(false);
        }
    }

    const addStat = () => {
        const newStat = {
            label: '',
            value: '',
            category: 'technical',
            display_order: stats.length
        };
        setStats([...stats, newStat]);
    };

    const removeStat = (index: number) => {
        const newStats = stats.filter((_, i) => i !== index);
        setStats(newStats);
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setStats(newStats);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // For production, we delete and re-insert for simplicity in this demo
            // In a real app, you'd use a more sophisticated sync logic
            const { error: deleteError } = await supabase
                .from('player_stats')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            if (deleteError) throw deleteError;

            if (stats.length > 0) {
                const statsToInsert = stats.map((s, i) => ({
                    label: s.label,
                    value: s.value,
                    category: s.category,
                    display_order: i
                }));

                const { error: insertError } = await supabase
                    .from('player_stats')
                    .insert(statsToInsert);

                if (insertError) throw insertError;
            }

            setMessage({ type: 'success', text: 'Stats updated successfully!' });
            fetchStats();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
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
            <div className="flex min-h-screen bg-black text-white">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white mb-2">Player Stats</h1>
                                <p className="text-gray-400">Manage technical, cognitive, and physical attributes</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={addStat}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Metric
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-benfica-red hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                                    <tr>
                                        <th className="px-6 py-4">Metric Label</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {stats.map((stat, index) => (
                                        <tr key={index} className="group hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-700"
                                                    placeholder="e.g. Dribbling"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-benfica-red font-bold"
                                                    placeholder="e.g. 92%"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={stat.category}
                                                    onChange={(e) => updateStat(index, 'category', e.target.value)}
                                                    className="bg-black border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:border-benfica-red outline-none"
                                                >
                                                    {['technical', 'cognitive', 'physical'].map(cat => (
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
                                    No stats found. Click &quot;Add Metric&quot; to create one.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
