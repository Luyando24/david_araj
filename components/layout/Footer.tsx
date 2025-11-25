import Link from 'next/link';
import { Instagram, Youtube, MessageCircle, Mail } from 'lucide-react';
import { PLAYER_INFO, NAV_ITEMS } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-4 text-benfica-red">
                            DAVID ARAJ
                        </h3>
                        <p className="text-gray-300 mb-4">
                            {PLAYER_INFO.tagline}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {PLAYER_INFO.position} | {PLAYER_INFO.location}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-display font-semibold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-300 hover:text-benfica-red transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="text-lg font-display font-semibold mb-4">
                            Connect
                        </h4>
                        <div className="space-y-3">
                            <a
                                href={`mailto:${PLAYER_INFO.email}`}
                                className="flex items-center space-x-2 text-gray-300 hover:text-benfica-red transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span>{PLAYER_INFO.email}</span>
                            </a>

                            <div className="flex space-x-4 mt-4">
                                <a
                                    href={PLAYER_INFO.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-benfica-red transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a
                                    href={PLAYER_INFO.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-benfica-red transition-colors"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="w-6 h-6" />
                                </a>
                                <a
                                    href={`https://wa.me/${PLAYER_INFO.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-benfica-red transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} David Fahd Araj. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
