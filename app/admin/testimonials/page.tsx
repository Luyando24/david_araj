'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { MessageSquare } from 'lucide-react';

export default function AdminTestimonialsPage() {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Testimonials Management</h1>
                        <p className="text-gray-400 mb-8">Manage coach testimonials and evaluations</p>

                        <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                            <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Testimonials Management</h3>
                            <p className="text-gray-400 mb-4">
                                Testimonials are currently managed in lib/constants.ts
                            </p>
                            <p className="text-sm text-gray-500">
                                To enable dynamic testimonial editing, integrate with Supabase and create editor interface.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
