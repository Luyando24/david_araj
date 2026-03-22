import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a professional storage client using the service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function uploadFile(file: File, path: string, bucket: string = 'gallery') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
