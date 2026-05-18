'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('portal_session')?.value
    
    if (token) {
      // Delete session from database
      await db.query('DELETE FROM sessions WHERE session_token = $1', [token]).catch(() => {})
      
      // Clear cookie
      cookieStore.delete('portal_session')
    }
  } catch {
    // Silently fail cleanup — cookie deletion is the critical part
  }
  redirect('/login')
}