import { db } from '@/db/database';
import { hashPin, verifyPin } from '@/utils/hashPin';
import type { User } from '@/types';

const SESSION_KEY = 'SHgestions_session';

export const authService = {
  async login(username: string, pin: string): Promise<User | null> {
    const user = await db.users.where('username').equals(username.toLowerCase().trim()).first();
    if (!user) return null;

    const valid = await verifyPin(pin, user.pinHash);
    if (!valid) return null;

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));
    return user;
  },

  async register(username: string, displayName: string, pin: string): Promise<{ success: boolean; error?: string; user?: User }> {
    const trimmedUsername = username.toLowerCase().trim();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      return { success: false, error: "L'usuari ha de tenir almenys 3 caràcters." };
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'El PIN ha de ser de 4 dígits numèrics.' };
    }

    // Check if username exists
    const existing = await db.users.where('username').equals(trimmedUsername).first();
    if (existing) {
      return { success: false, error: 'Aquest nom d\'usuari ja existeix.' };
    }

    const pinHash = await hashPin(pin);
    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      username: trimmedUsername,
      displayName: displayName.trim() || trimmedUsername,
      pinHash,
      createdAt: now,
      updatedAt: now,
    };

    await db.users.add(user);

    // Auto-login
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));

    return { success: true, user };
  },

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },

  getSession(): { userId: string; username: string } | null {
    const data = sessionStorage.getItem(SESSION_KEY);
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
