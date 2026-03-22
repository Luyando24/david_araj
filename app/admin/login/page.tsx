'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Sign in with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email.toLowerCase().trim(),
                password: password,
            });

            if (authError) throw authError;

            // 2. Check if the user is authorized in our 'admins' table
            // Using ilike for case-insensitive email matching just in case
            const { data: adminData, error: adminError } = await supabase
                .from('admins')
                .select('*')
                .ilike('email', email.toLowerCase().trim())
                .maybeSingle();

            if (adminError) {
                console.error('Database check error:', adminError);
                throw new Error('System error verifying authorization. Check your "admins" table.');
            }

            if (!adminData) {
                // If not in our authorized list, sign them out immediately
                await supabase.auth.signOut();
                throw new Error('Access denied. This email is not in the authorized Admin list.');
            }

            // Success
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error('Login process error:', err);
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-benfica-red/10 rounded-full mb-4">
                        <Lock className="w-10 h-10 text-benfica-red" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">Admin Entry</h1>
                    <p className="text-gray-400">Secure access to the portfolio engine</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-benfica-red/5 rounded-full blur-3xl -z-10"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-3 pl-10 text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-800"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/input:text-benfica-red transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-3 pl-10 text-white focus:border-benfica-red outline-none transition-all placeholder:text-gray-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-benfica-red hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-red-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-gray-600 text-sm italic">
                    Protected by Supabase Infrastructure
                </p>
            </div>
        </main>
    );
}
