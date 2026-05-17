import { createClient } from '@supabase/supabase-js'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || ''
const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''

export const insforge = createClient(insforgeUrl, insforgeKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
})
