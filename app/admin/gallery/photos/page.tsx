'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { ImageIcon } from 'lucide-react';

export default function AdminPhotosPage() {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Photo Management</h1>
                        <p className="text-gray-400 mb-8">Manage photo gallery</p>

                        <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                            <ImageIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Photo Management</h3>
                            <p className="text-gray-400 mb-4">
                                Currently showing {60} photos from the hardcoded gallery data.
                            </p>
                            <p className="text-sm text-gray-500">
                                To enable dynamic photo management, integrate with Supabase Storage and create upload interface.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
