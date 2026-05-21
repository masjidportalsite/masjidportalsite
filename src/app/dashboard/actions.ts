'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'
import { createInsForgeServerClient } from '@/lib/insforge-sdk'

export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        
        // 1. Clear Legacy Portal Session
        const portalToken = cookieStore.get('portal_session')?.value
        if (portalToken) {
            await pool.query('DELETE FROM sessions WHERE session_token = $1', [portalToken]).catch(() => { })
            cookieStore.delete('portal_session')
        }

        // 2. Clear InsForge Session
        const insforgeToken = cookieStore.get('insforge_session')?.value
        if (insforgeToken) {
            try {
                const insforge = createInsForgeServerClient(insforgeToken)
                await insforge.auth.signOut()
            } catch {
                // Silently fail SDK sign-out
            }
            cookieStore.delete('insforge_session')
        }

    } catch (error) {
        console.error('[Auth] Logout cleanup error:', error)
    }
    
    redirect('/login')
}
