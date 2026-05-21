'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'

export async function loginAction(state: unknown, formData: FormData) {
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    try {
        // Primary Flow: Custom PostgreSQL Authentication
        const { rows } = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email])

        if (rows.length > 0) {
            const user = rows[0]
            const matchResult = await pool.query(
                `SELECT crypt($1, password_hash) = password_hash AS match FROM users WHERE id = $2`,
                [password, user.id]
            )
            
            if (matchResult.rows[0]?.match) {
                const sessionToken = crypto.randomUUID()
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

                await pool.query(
                    'INSERT INTO sessions (user_id, session_token, expires) VALUES ($1, $2, $3)',
                    [user.id, sessionToken, expires]
                )

                const cookieStore = await cookies()
                cookieStore.set('portal_session', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60,
                    path: '/'
                })
                redirect('/dashboard')
            }
        }

        return { error: 'Invalid email or password. Hint: Use Demo123! for demo accounts.' }

    } catch (error) {
        // Handle redirect "error" which is actually a Next.js navigation trigger
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error
        }
        console.error('Login error:', error)
        return { error: 'An unexpected error occurred during login' }
    }
}
