import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ras_almal_session";
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const hash = scryptSync(password, salt, 64).toString("hex"); return `${salt}:${hash}`; }
export function verifyPassword(password: string, stored: string) { const [salt, key] = stored.split(":"); if (!salt || !key) return false; const derived = scryptSync(password, salt, 64); return timingSafeEqual(derived, Buffer.from(key, "hex")); }
export function createSessionToken() { return randomBytes(32).toString("hex"); }
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function validUsername(username: string) { return /^[a-zA-Z0-9_\u0600-\u06ff]{3,24}$/.test(username); }
