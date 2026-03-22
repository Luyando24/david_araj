import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { 
    PLAYER_INFO, 
    CHARACTER_DATA, 
    PLAYER_SUMMARY, 
    CAREER_HIGHLIGHTS, 
    TECHNICAL_STATS, 
    PHYSICAL_STATS, 
    TESTIMONIAL 
} from '../lib/constants';
import { GALLERY_PHOTOS, GALLERY_VIDEOS } from '../lib/gallery-data';

// Load .env.local manually since we're running as a script
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
            }
        });
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Starting seeding...');

    // 1. Clear existing data
    console.log('Cleaning up existing data...');
    await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('player_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('career_highlights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('player_details').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('gallery_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('gallery_videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Player Details
    console.log('Seeding player_details...');
    const { error: playerError } = await supabase.from('player_details').insert([{
        full_name: PLAYER_INFO.fullName,
        age: PLAYER_INFO.age,
        height: PLAYER_INFO.height,
        weight: PLAYER_INFO.weight,
        nationality: PLAYER_INFO.nationality,
        position: PLAYER_INFO.position,
        footedness: PLAYER_INFO.footedness,
        location: PLAYER_INFO.location,
        tagline: PLAYER_INFO.tagline,
        email: PLAYER_INFO.email,
        phone: PLAYER_INFO.phone,
        whatsapp: PLAYER_INFO.whatsapp,
        instagram: PLAYER_INFO.instagram,
        youtube: PLAYER_INFO.youtube,
        training_volume: CHARACTER_DATA.trainingVolume,
        gpa: CHARACTER_DATA.gpa,
        attendance: CHARACTER_DATA.attendance,
        family_environment: CHARACTER_DATA.familyEnvironment,
        summary: PLAYER_SUMMARY
    }]);
    if (playerError) console.error('Error seeding player_details:', playerError);

    // 3. Insert Career Highlights
    console.log('Seeding career_highlights...');
    const highlights = CAREER_HIGHLIGHTS.map((h, index) => ({
        title: h.title,
        description: h.description,
        details: h.details,
        icon: h.icon,
        year: h.year,
        display_order: index
    }));
    const { error: highlightsError } = await supabase.from('career_highlights').insert(highlights);
    if (highlightsError) console.error('Error seeding career_highlights:', highlightsError);

    // 4. Insert Player Stats
    console.log('Seeding player_stats...');
    const technical = TECHNICAL_STATS.map((s, index) => ({
        label: s.label,
        value: s.value,
        category: s.category,
        display_order: index
    }));
    const physical = PHYSICAL_STATS.map((s, index) => ({
        label: s.label,
        value: s.value,
        category: s.category,
        display_order: index + technical.length
    }));
    const { error: statsError } = await supabase.from('player_stats').insert([...technical, ...physical]);
    if (statsError) console.error('Error seeding player_stats:', statsError);

    // 5. Insert Testimonials
    console.log('Seeding testimonials...');
    const { error: testimonialError } = await supabase.from('testimonials').insert([{
        text: TESTIMONIAL.text,
        coach: TESTIMONIAL.coach,
        title: TESTIMONIAL.title,
        display_order: 0
    }]);
    if (testimonialError) console.error('Error seeding testimonials:', testimonialError);

    // 6. Insert Gallery Photos
    console.log(`Seeding ${GALLERY_PHOTOS.length} photos...`);
    const { error: photosError } = await supabase.from('gallery_photos').insert(
        GALLERY_PHOTOS.map((p, i) => ({
            url: p.url,
            title: p.title,
            category: p.category,
            display_order: i
        }))
    );
    if (photosError) console.error('Error seeding gallery_photos:', photosError);

    // 7. Insert Gallery Videos
    console.log(`Seeding ${GALLERY_VIDEOS.length} videos...`);
    const { error: videosError } = await supabase.from('gallery_videos').insert(
        GALLERY_VIDEOS.map((v, i) => ({
            url: v.url,
            title: v.title,
            description: v.description,
            thumbnail: v.thumbnail,
            category: v.category,
            display_order: i
        }))
    );
    if (videosError) console.error('Error seeding gallery_videos:', videosError);

    console.log('Seeding completed successfully!');
}

seed().catch(console.error);
