import type { AuthSession, AuthSnapshot, AuthUser } from '../types';
import { readJson, writeJson } from './storage';

const USERS_KEY = 'ts_auth_users';
const SESSION_KEY = 'ts_auth_session';
const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_PERMISSIONS = ['orders:read', 'messages:read', 'cart:checkout'];

function now(): number {
  return Date.now();
}

function uid(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function makeToken(prefix: string): string {
  return `${prefix}_${uid().replace(/-/g, '')}_${Date.now().toString(36)}`;
}

function normalizeEmail(email: string | undefined | null): string {
  return String(email || '').trim().toLowerCase();
}

async function passwordDigest(password: string): Promise<string> {
  const value = String(password || '');
  if (globalThis.crypto?.subtle && globalThis.TextEncoder) {
    const bytes = new TextEncoder().encode(value);
    const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return btoa(value);
}

function getUsers(): AuthUser[] {
  return readJson<AuthUser[]>(USERS_KEY, []);
}

function saveUsers(users: AuthUser[]): void {
  writeJson(USERS_KEY, users);
}

function createSession(user: AuthUser): AuthSession {
  const issuedAt = now();
  const session: AuthSession = {
    userId: user.id,
    accessToken: makeToken('access'),
    refreshToken: makeToken('refresh'),
    issuedAt,
    accessExpiresAt: issuedAt + ACCESS_TOKEN_TTL,
    refreshExpiresAt: issuedAt + REFRESH_TOKEN_TTL,
  };
  writeJson(SESSION_KEY, session);
  return session;
}

export function getSession(): AuthSession | null {
  return readJson<AuthSession | null>(SESSION_KEY, null);
}

export function getCurrentUser(): AuthUser | null {
  const session = getSession();
  if (!session || session.refreshExpiresAt <= now()) return null;
  return getUsers().find((user) => user.id === session.userId) || null;
}

export function getAuthSnapshot(): AuthSnapshot {
  const session = getSession();
  const user = getCurrentUser();
  return {
    user,
    session,
    isAuthenticated: Boolean(user && session),
    accessValid: Boolean(session && session.accessExpiresAt > now()),
    refreshValid: Boolean(session && session.refreshExpiresAt > now()),
  };
}

export async function registerUser({ name, email, password }: { name?: string; email?: string; password?: string }): Promise<{ user: AuthUser; session: AuthSession }> {
  const cleanName = String(name || '').trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || '');

  if (cleanName.length < 2) throw new Error('Enter your name.');
  if (!cleanEmail.includes('@')) throw new Error('Enter a valid email address.');
  if (cleanPassword.length < 6) throw new Error('Password must be at least 6 characters.');

  const users = getUsers();
  if (users.some((user) => user.email === cleanEmail)) {
    throw new Error('This email already has a simulated account.');
  }

  const user: AuthUser = {
    id: uid(),
    name: cleanName,
    email: cleanEmail,
    role: 'buyer',
    permissions: DEFAULT_PERMISSIONS,
    passwordHash: await passwordDigest(cleanPassword),
    createdAt: now(),
  };
  saveUsers([...users, user]);
  return { user, session: createSession(user) };
}

export async function loginUser({ email, password }: { email?: string; password?: string }): Promise<{ user: AuthUser; session: AuthSession }> {
  const cleanEmail = normalizeEmail(email);
  const users = getUsers();
  const user = users.find((entry) => entry.email === cleanEmail);
  if (!user || user.passwordHash !== (await passwordDigest(password || ''))) {
    throw new Error('Email or password is not correct.');
  }
  return { user, session: createSession(user) };
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function refreshSession(): AuthSession {
  const session = getSession();
  const user = getCurrentUser();
  if (!session || !user || session.refreshExpiresAt <= now()) {
    logoutUser();
    throw new Error('Refresh token expired. Log in again.');
  }
  return createSession(user);
}

export function maskToken(token: string | undefined | null): string {
  if (!token) return 'not issued';
  if (token.length <= 22) return token;
  return `${token.slice(0, 14)}...${token.slice(-6)}`;
}
