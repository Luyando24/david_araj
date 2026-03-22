'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function createAdminAccount(email: string, password: string, fullName: string) {
    try {
        // 1. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase().trim(),
            password: password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) throw authError;

        // 2. Add them to our 'admins' table for authorization tracking
        const { error: dbError } = await supabaseAdmin
            .from('admins')
            .upsert({
                email: email.toLowerCase().trim(),
                full_name: fullName,
                role: 'admin'
            }, { onConflict: 'email' });

        if (dbError) throw dbError;

        revalidatePath('/admin/admins');
        return { success: true };
    } catch (error: any) {
        console.error('Error creating admin account:', error);
        return { success: false, error: error.message };
    }
}

export async function removeAdminAccount(id: string, email: string) {
    try {
        // 1. Find user in auth.users by email
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        const authUser = users.find(u => u.email === email);
        
        // 2. Remove from auth if found
        if (authUser) {
            await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }

        // 3. Remove from our 'admins' table
        const { error: dbError } = await supabaseAdmin
            .from('admins')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        revalidatePath('/admin/admins');
        return { success: true };
    } catch (error: any) {
        console.error('Error removing admin account:', error);
        return { success: false, error: error.message };
    }
}
