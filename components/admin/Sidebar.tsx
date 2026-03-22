'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    Users, 
    Trophy, 
    BarChart3, 
    MessageSquare, 
    Mail, 
    LogOut,
    Image as ImageIcon,
    Video,
    Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Photos', href: '/admin/gallery/photos', icon: ImageIcon },
    { name: 'Videos', href: '/admin/gallery/videos', icon: Video },
    { name: 'Player Info', href: '/admin/player-info', icon: Users },
    { name: 'Highlights', href: '/admin/highlights', icon: Trophy },
    { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Contacts', href: '/admin/contacts', icon: Mail },
    { name: 'Admins', href: '/admin/admins', icon: Shield },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
            <div className="p-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-benfica-red rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold text-white tracking-tight">Admin<span className="text-benfica-red">CMS</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                    ? 'bg-benfica-red text-white shadow-lg shadow-red-500/10' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group font-bold"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
