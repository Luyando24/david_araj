// Admin Authentication Utilities
// IMPORTANT: In production, it is highly recommended to use Supabase Auth
// for better security, 2FA, and audit logs.

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

/**
 * Validates the provided password against the environment variable.
 */
export function checkAdminPassword(password: string): boolean {
    if (ADMIN_PASSWORD === 'admin123' && process.env.NODE_ENV === 'production') {
        console.warn('WARNING: Using default admin password in production! Change NEXT_PUBLIC_ADMIN_PASSWORD.');
    }
    return password === ADMIN_PASSWORD;
}

/**
 * Sets the admin session in sessionStorage.
 */
export function setAdminSession() {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_session_start', new Date().toISOString());
    }
}

/**
 * Clears the admin session.
 */
export function clearAdminSession() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_session_start');
    }
}

/**
 * Checks if the current user is authenticated as an admin.
 */
export function isAdminAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('admin_authenticated') === 'true';
    }
    return false;
}
