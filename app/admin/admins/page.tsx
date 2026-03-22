'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { createAdminAccount, removeAdminAccount } from '@/app/actions/admin-actions';
import { Plus, Trash2, Shield, Loader2, AlertCircle, CheckCircle2, User, Mail, Lock, X } from 'lucide-react';

export default function AdminManagement() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [admins, setAdmins] = useState<any[]>([]);
    
    // New Admin Form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    async function fetchAdmins() {
        try {
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setAdmins(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (!newAdmin.email || !newAdmin.password || !newAdmin.fullName) {
                throw new Error('Please fill in all fields');
            }

            const result = await createAdminAccount(newAdmin.email, newAdmin.password, newAdmin.fullName);
            
            if (result.success) {
                setSuccess(`Successfully added ${newAdmin.fullName} as an admin.`);
                setNewAdmin({ email: '', fullName: '', password: '', role: 'admin' });
                setShowAddForm(false);
                fetchAdmins();
            } else {
                setError(result.error || 'Failed to create account');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        if (!confirm('Are you sure you want to remove this admin? They will lose all access.')) return;
        
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await removeAdminAccount(id, email);
            if (result.success) {
                setSuccess('Admin removed successfully.');
                fetchAdmins();
            } else {
                setError(result.error || 'Failed to remove admin');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
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
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow-red tracking-tight">Access Control</h1>
                                <p className="text-gray-400">Manage authorized personnel and their security credentials</p>
                            </div>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-benfica-red hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 font-bold"
                            >
                                <Plus className="w-5 h-5" />
                                {showAddForm ? 'Cancel' : 'Add New Admin'}
                            </button>
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

                        {showAddForm && (
                            <div className="mb-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-benfica-red/30 p-8 animate-fade-in relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-benfica-red/5 rounded-full blur-3xl -z-10"></div>
                                <h2 className="text-2xl font-display font-bold text-white mb-6">Create New Credentials</h2>
                                <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                                <input
                                                    type="text"
                                                    value={newAdmin.fullName}
                                                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 pl-10 text-sm text-white focus:border-benfica-red outline-none transition-all"
                                                    placeholder="e.g. Cristiano Ronaldo"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                                            <div className="relative group/input">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                                <input
                                                    type="email"
                                                    value={newAdmin.email}
                                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 pl-10 text-sm text-white focus:border-benfica-red outline-none transition-all"
                                                    placeholder="name@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Initial Password</label>
                                            <div className="relative group/input">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                                <input
                                                    type="password"
                                                    value={newAdmin.password}
                                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 pl-10 text-sm text-white focus:border-benfica-red outline-none transition-all"
                                                    placeholder="Min 6 characters"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-2 ml-1 italic">* Passwords are hashed and encrypted instantly upon creation.</p>
                                        </div>
                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={actionLoading}
                                                className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-xl disabled:opacity-50"
                                            >
                                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                                Initialize Account
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {admins.map((admin) => (
                                <div key={admin.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 group hover:border-benfica-red/30 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Shield className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-benfica-red transition-colors duration-500">
                                            <Shield className="w-6 h-6 text-benfica-red group-hover:text-white transition-colors" />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                            className="text-gray-600 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-red-500/5 group/del"
                                            title="Revoke Access"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-display font-bold text-white group-hover:text-benfica-red transition-colors">{admin.full_name}</h3>
                                        <p className="text-gray-400 text-sm truncate">{admin.email}</p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-green-500/20">
                                            Authorized
                                        </span>
                                        <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-gray-700">
                                            {admin.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {admins.length === 0 && (
                            <div className="py-24 text-center bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                                <Shield className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-500">No Authorized Admins</h2>
                                <p className="text-gray-600 mt-2">Initialize the first system administrator to begin.</p>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="mt-8 bg-benfica-red/10 hover:bg-benfica-red/20 text-benfica-red px-6 py-3 rounded-xl border border-benfica-red/20 transition-all font-bold"
                                >
                                    Create First Admin
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
