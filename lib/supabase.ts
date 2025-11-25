import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get all photos
export async function getPhotos() {
    const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }

    return data;
}

// Helper function to get all videos
export async function getVideos() {
    const { data, error } = await supabase
        .from('gallery_videos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching videos:', error);
        return [];
    }

    return data;
}

// Helper function to get player stats
export async function getPlayerStats() {
    const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .order('category', { ascending: true });

    if (error) {
        console.error('Error fetching stats:', error);
        return [];
    }

    return data;
}

// Helper function to get testimonials
export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }

    return data;
}

// Helper function to submit contact form
export async function submitContact(formData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
}) {
    const { data, error } = await supabase
        .from('contact_submissions')
        .insert([formData])
        .select();

    if (error) {
        console.error('Error submitting contact:', error);
        throw error;
    }

    return data;
}
