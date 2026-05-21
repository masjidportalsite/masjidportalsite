import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSession, hasRole } from './auth';
import { UserRole } from '@/types/auth';

// Mock Next.js headers
const mockCookies = vi.fn();
vi.mock('next/headers', () => ({
    cookies: () => mockCookies()
}));

// Mock Database adapters
vi.mock('./auth/adapters', () => {
    return {
        InsForgeJwtAdapter: vi.fn().mockImplementation(() => ({
            getSession: vi.fn().mockResolvedValue(null)
        })),
        PostgresSessionAdapter: vi.fn().mockImplementation(() => ({
            getSession: vi.fn().mockImplementation((token: string) => {
                if (token === 'valid-token') {
                    return Promise.resolve({
                        id: '1',
                        email: 'test@masjid.local',
                        role: UserRole.SUPER_ADMIN,
                        full_name: 'Test Admin'
                    });
                }
                return Promise.resolve(null);
            })
        }))
    };
});

describe('Authentication Flow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getSession()', () => {
        it('returns null when no cookies are present', async () => {
            mockCookies.mockReturnValue({
                get: vi.fn().mockReturnValue(undefined)
            });

            const user = await getSession();
            expect(user).toBeNull();
        });

        it('returns user when a valid legacy portal_session exists', async () => {
            mockCookies.mockReturnValue({
                get: (name: string) => {
                    if (name === 'portal_session') return { value: 'valid-token' };
                    return undefined;
                }
            });

            const user = await getSession();
            expect(user).not.toBeNull();
            expect(user?.role).toBe(UserRole.SUPER_ADMIN);
        });

        it('returns null for invalid portal_session', async () => {
            mockCookies.mockReturnValue({
                get: (name: string) => {
                    if (name === 'portal_session') return { value: 'invalid-token' };
                    return undefined;
                }
            });

            const user = await getSession();
            expect(user).toBeNull();
        });
    });

    describe('hasRole()', () => {
        const mockUser = {
            id: '1',
            email: 'test@masjid.local',
            role: UserRole.IMAM,
            full_name: 'Test User',
            organization_id: 'org_123'
            };

        it('returns true if user has one of the allowed roles', () => {
            expect(hasRole(mockUser, [UserRole.IMAM, UserRole.SUPER_ADMIN])).toBe(true);
        });

        it('returns false if user does not have an allowed role', () => {
            expect(hasRole(mockUser, [UserRole.SUPER_ADMIN])).toBe(false);
        });
    });
});
