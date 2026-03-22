'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Get current session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    router.push('/admin/login');
                    return;
                }

                // 2. Double check authorization in 'admins' table
                const { data: adminData, error } = await supabase
                    .from('admins')
                    .select('*')
                    .eq('email', session.user.email)
                    .single();

                if (error || !adminData) {
                    await supabase.auth.signOut();
                    router.push('/admin/login');
                    return;
                }

                setAuthorized(true);
            } catch (err) {
                console.error('Auth check error:', err);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-benfica-red animate-spin" />
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}
