import { NextResponse } from 'next/server';
import { PLAYER_INFO, TECHNICAL_STATS, PHYSICAL_STATS, CAREER_HIGHLIGHTS, TESTIMONIAL } from '@/lib/constants';
import { jsPDF } from 'jspdf';

export async function GET() {
    try {
        const doc = new jsPDF();
        const lineHeight = 7;
        let yPos = 20;

        // Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('DAVID FAHD ARAJ', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('PROFESSIONAL FOOTBALL PLAYER', 20, yPos);
        yPos += 15;

        // Basic Info
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BASIC INFORMATION', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Age: ${PLAYER_INFO.age}`, 20, yPos);
        yPos += 6;
        doc.text(`Position: ${PLAYER_INFO.position}`, 20, yPos);
        yPos += 6;
        doc.text(`Nationality: ${Array.isArray(PLAYER_INFO.nationality) ? PLAYER_INFO.nationality.join(' / ') : PLAYER_INFO.nationality}`, 20, yPos);
        yPos += 6;
        doc.text(`Location: ${PLAYER_INFO.location}`, 20, yPos);
        yPos += 6;
        doc.text(`Height: ${PLAYER_INFO.height} | Weight: ${PLAYER_INFO.weight}`, 20, yPos);
        yPos += 12;

        // Tagline
        doc.setFont('helvetica', 'italic');
        doc.text(`"${PLAYER_INFO.tagline}"`, 20, yPos);
        yPos += 15;

        // Technical Stats
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KEY METRICS', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        TECHNICAL_STATS.slice(0, 6).forEach(stat => {
            doc.text(`${stat.label}: ${stat.value}`, 20, yPos);
            yPos += 6;
        });
        yPos += 10;

        // Career Highlights
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CAREER HIGHLIGHTS', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        CAREER_HIGHLIGHTS.forEach(h => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${h.title} (${h.year})`, 20, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.text(h.description, 25, yPos);
            yPos += 8;
        });
        yPos += 5;

        // Testimonial
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('COACH TESTIMONIAL', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const splitText = doc.splitTextToSize(`"${TESTIMONIAL.text}"`, 170);
        doc.text(splitText, 20, yPos);
        yPos += (splitText.length * 5) + 5;

        doc.setFont('helvetica', 'bold');
        doc.text(`- ${TESTIMONIAL.coach}, ${TESTIMONIAL.title}`, 20, yPos);
        yPos += 15;

        // Contact
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CONTACT', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${PLAYER_INFO.email}`, 20, yPos);
        yPos += 6;
        doc.text(`Phone: ${PLAYER_INFO.phone}`, 20, yPos);

        // Output
        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="David_Araj_Profile.pdf"',
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
