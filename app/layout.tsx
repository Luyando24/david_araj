import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: '--font-montserrat',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
    title: "David Fahd Araj - Professional Football Player Portfolio",
    description: "17-year-old attacking midfielder with Benfica validation and MLS projection. American/Jordanian talent based in Washington D.C.",
    keywords: ["David Araj Football", "David F. Araj No.10", "Benfica Academy", "MLS Prospect", "Attacking Midfielder"],
    authors: [{ name: "David Fahd Araj" }],
    openGraph: {
        title: "David Fahd Araj - Professional Football Player",
        description: "Creative No.10 with European Validation & MLS Projection",
        type: "profile",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "David Fahd Araj - Professional Football Player",
        description: "Creative No.10 with European Validation & MLS Projection",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            "name": "David Fahd Araj",
                            "jobTitle": "Professional Football Player",
                            "description": "Attacking Midfielder (No.10) with Benfica Academy validation",
                            "nationality": ["American", "Jordanian"],
                            "birthPlace": "Washington D.C., USA",
                            "sport": "Football (Soccer)",
                            "position": "Attacking Midfielder",
                            "height": "5'8½\"",
                            "weight": "145 lbs",
                            "memberOf": {
                                "@type": "SportsOrganization",
                                "name": "Benfica Academy"
                            }
                        })
                    }}
                />
            </head>
            <body className="antialiased">
                {children}
                <FloatingWhatsApp />
            </body>
        </html>
    );
}
