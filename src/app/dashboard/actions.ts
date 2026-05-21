'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'

export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        
        const portalToken = cookieStore.get('portal_session')?.value
        if (portalToken) {
            await pool.query('DELETE FROM sessions WHERE session_token = $1', [portalToken]).catch(() => { })
            cookieStore.delete('portal_session')
        }

        // Cleanup any drift cookies
        cookieStore.delete('insforge_session')

    } catch (error) {
        console.error('[Auth] Logout cleanup error:', error)
    }
    
    redirect('/login')
}
