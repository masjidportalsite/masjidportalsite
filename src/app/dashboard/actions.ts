'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'

export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('portal_session')?.value
        if (token) {
            await pool.query('DELETE FROM sessions WHERE session_token = $1', [token]).catch(() => { })
            cookieStore.delete('portal_session')
        }
    } catch {
        // Silently fail cleanup — cookie deletion is the critical part
    }
    redirect('/login')
}
