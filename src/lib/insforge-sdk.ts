/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock InsForge SDK implementation for the Masjid Portal Site
export interface InsForgeClient {
  auth: {
    signIn: (email: string, password?: string) => Promise<{ session: any; error: any }>;
    signInWithOtp: (params: { email: string }) => Promise<{ error: any }>;
    signInWithOAuth: (params: { provider: 'google' }) => Promise<{ error: any }>;
    verifyOtp: (email: string, token: string) => Promise<{ session: any; error: any }>;
    signOut: () => Promise<void>;
    getUser: () => Promise<{ user: any; error: any }>;
  };
  from: (table: string) => {
    select: (query?: string) => any;
    insert: (data: any) => any;
    update: (data: any) => any;
    delete: () => any;
  };
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<{ data: any; error: any }>;
    }
  }
}

export const createClient = (url: string, key: string): InsForgeClient => {
  return {
    auth: {
      signIn: async (email, password) => {
        console.log(`[InsForge] Authenticating ${email}...`);
        return { session: { access_token: 'mock-jwt-token' }, error: null };
      },
      signInWithOtp: async ({ email }) => {
        console.log(`[InsForge] Sending OTP to ${email}...`);
        return { error: null };
      },
      signInWithOAuth: async ({ provider }) => {
        console.log(`[InsForge] Redirecting to ${provider} OAuth...`);
        return { error: null };
      },
      verifyOtp: async (email, token) => {
        console.log(`[InsForge] Verifying OTP ${token} for ${email}...`);
        if (token === '123456') return { session: { access_token: 'mock-jwt-token' }, error: null };
        return { session: null, error: { message: 'Invalid OTP' } };
      },
      signOut: async () => {
        console.log(`[InsForge] Signed out.`);
      },
      getUser: async () => {
        return { user: { id: 'mock-uuid', role: 'admin' }, error: null };
      }
    },
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => Promise.resolve({ data, error: null }),
      delete: () => Promise.resolve({ error: null })
    }),
    storage: {
      from: (bucket) => ({
        upload: async (path, file) => {
          console.log(`[InsForge Storage] Uploading to ${bucket}/${path}...`);
          return { data: { path }, error: null };
        }
      })
    }
  };
};
