'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { BarChart3 } from 'lucide-react';

export default function AdminStatsPage() {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Stats Management</h1>
                        <p className="text-gray-400 mb-8">Update player statistics and metrics</p>

                        <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                            <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Stats Management</h3>
                            <p className="text-gray-400 mb-4">
                                Player stats are currently managed in lib/constants.ts
                            </p>
                            <p className="text-sm text-gray-500">
                                To enable dynamic stats editing, integrate with Supabase and create editor interface.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
