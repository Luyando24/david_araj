'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Users, Mail, Image as ImageIcon, Video, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState([
        { label: 'Photos', value: '...', icon: ImageIcon, href: '/admin/gallery/photos', color: 'bg-blue-500' },
        { label: 'Videos', value: '...', icon: Video, href: '/admin/gallery/videos', color: 'bg-purple-500' },
        { label: 'Contact Submissions', value: '...', icon: Mail, href: '/admin/contacts', color: 'bg-green-500' },
        { label: 'Authorized Admins', value: '...', icon: Shield, href: '/admin/admins', color: 'bg-benfica-red' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const [
                { count: photoCount },
                { count: videoCount },
                { count: contactCount },
                { count: adminCount }
            ] = await Promise.all([
                supabase.from('gallery_photos').select('*', { count: 'exact', head: true }),
                supabase.from('gallery_videos').select('*', { count: 'exact', head: true }),
                supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
                supabase.from('admins').select('*', { count: 'exact', head: true }),
            ]);

            setStats([
                { label: 'Photos', value: (photoCount || 0).toString(), icon: ImageIcon, href: '/admin/gallery/photos', color: 'bg-blue-500' },
                { label: 'Videos', value: (videoCount || 0).toString(), icon: Video, href: '/admin/gallery/videos', color: 'bg-purple-500' },
                { label: 'Contact Submissions', value: (contactCount || 0).toString(), icon: Mail, href: '/admin/contacts', color: 'bg-green-500' },
                { label: 'Authorized Admins', value: (adminCount || 0).toString(), icon: Shield, href: '/admin/admins', color: 'bg-benfica-red' },
            ]);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
                                <p className="text-gray-400">Welcome to your production CMS</p>
                            </div>
                            {loading && <Loader2 className="w-6 h-6 text-benfica-red animate-spin" />}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <Link
                                        key={stat.label}
                                        href={stat.href}
                                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-benfica-red transition-all duration-200 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Icon className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-display font-bold text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-gray-400 text-sm">{stat.label}</div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">Content Management</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/admin/gallery/photos"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-200 border border-transparent hover:border-benfica-red"
                                >
                                    <ImageIcon className="w-8 h-8 text-benfica-gold mx-auto mb-3" />
                                    <div className="text-white font-semibold">Manage Photos</div>
                                </Link>
                                <Link
                                    href="/admin/gallery/videos"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-200 border border-transparent hover:border-benfica-red"
                                >
                                    <Video className="w-8 h-8 text-benfica-gold mx-auto mb-3" />
                                    <div className="text-white font-semibold">Manage Videos</div>
                                </Link>
                                <Link
                                    href="/admin/player-info"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-200 border border-transparent hover:border-benfica-red"
                                >
                                    <Users className="w-8 h-8 text-benfica-gold mx-auto mb-3" />
                                    <div className="text-white font-semibold">Player Profile</div>
                                </Link>
                                <Link
                                    href="/admin/contacts"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-200 border border-transparent hover:border-benfica-red"
                                >
                                    <Mail className="w-8 h-8 text-benfica-gold mx-auto mb-3" />
                                    <div className="text-white font-semibold">Inbound Leads</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
