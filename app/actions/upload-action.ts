'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    const bucket = 'gallery';
    const folder = 'photos';

    if (!file) {
        throw new Error('No file provided');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        });

    if (error) {
        console.error('Upload error:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return { url: publicUrl };
}
