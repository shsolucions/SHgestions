import { db } from '@/db/database';
import { hashPin, verifyPin } from '@/utils/hashPin';
import type { User } from '@/types';

const SESSION_KEY = 'SHgestions_session';

export const authService = {
  async login(username: string, pin: string): Promise<User | null> {
    const cleanUsername = username.toLowerCase().trim();
    if (!cleanUsername || !pin) return null;

    // Search user
    const user = await db.users.where('username').equals(cleanUsername).first();
    if (!user) {
      console.warn('[Auth] User not found:', cleanUsername);
      return null;
    }

    // Verify PIN
    const valid = await verifyPin(pin, user.pinHash);
    if (!valid) {
      console.warn('[Auth] Invalid PIN for user:', cleanUsername);
      return null;
    }

    // Save session to localStorage (persists after closing browser)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));
    return user;
  },

  async register(username: string, displayName: string, pin: string): Promise<{ success: boolean; error?: string; user?: User }> {
    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'usernameMin' };
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'pinMustBe4' };
    }

    // Check if username already exists
    const existing = await db.users.where('username').equals(cleanUsername).first();
    if (existing) {
      return { success: false, error: 'usernameExists' };
    }

    const pinHash = await hashPin(pin);
    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      pinHash,
      createdAt: now,
      updatedAt: now,
    };

    await db.users.add(user);

    // Auto-login with localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));

    return { success: true, user };
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): { userId: string; username: string } | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  },

  async changePin(userId: string, newPin: string): Promise<boolean> {
    const pinHash = await hashPin(newPin);
    await db.users.update(userId, {
      pinHash,
      updatedAt: new Date().toISOString(),
    });
    return true;
  },

  async getUser(userId: string): Promise<User | null> {
    return (await db.users.get(userId)) ?? null;
  },
};
