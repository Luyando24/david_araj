# Supabase Production Setup Guide

Follow these steps to configure your Supabase project for the David Araj Portfolio CMS.

## 1. Database Schema
Run the SQL from [lib/db/schema.sql](file:///c:/Users/User/Desktop/david/lib/db/schema.sql) in your Supabase **SQL Editor**. 
**Note**: This script is idempotent and safe to run multiple times; it will not overwrite your existing data but will ensure all tables and policies are correctly configured.

## 2. Storage Setup (Images)
To enable local image uploads:
1. Go to **Storage** in your Supabase Dashboard.
2. Create a new bucket named **`gallery`**.
3. Set the bucket to **Public**.

## 3. Email Authentication (Multi-Admin)
The CMS now uses **Supabase Auth** for individual admin accounts.
1. Go to **Authentication** -> **Configuration**.
2. Ensure **Email** is enabled as an auth provider.
3. Your first admin account can be added directly via the **Admins** section of your new CMS!

## 4. Environment Variables
Ensure your `.env.local` has the following (especially the Service Role key for administrative actions):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!WARNING]
> **Security**: Never share your `SUPABASE_SERVICE_ROLE_KEY`. It bypasses all RLS policies and is only used server-side for administrative tasks.

---

## Ready to Go!
1. Start your server: `npm run dev`
2. Visit `/admin/admins` to create your first secure account.
3. Visit `/admin/login` to log in with your new credentials.
