'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'

export async function loginAction(state: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    try {
        // Query the user
        const { rows } = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email])

        if (rows.length === 0) {
            return { error: 'Invalid email or password' }
        }

        const user = rows[0]

        // Since Postgres pgcrypto's crypt() is slow if we query it, we can verify via db query
        const matchResult = await pool.query(`SELECT crypt($1, password_hash) = password_hash AS match FROM users WHERE id = $2`, [password, user.id])
        const match = matchResult.rows[0]?.match

        if (!match) {
            return { error: 'Invalid password. Hint: Use Demo123! for demo accounts.' }
        }

        const sessionToken = crypto.randomUUID()
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week

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

    } catch (error) {
        console.error('Login error:', error)
        return { error: 'An unexpected error occurred during login' }
    }

    redirect('/dashboard')
}
