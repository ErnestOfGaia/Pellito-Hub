export const COOKIE_NAME = 'pellito_session';

type Role = 'admin' | 'linecook';

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signSession(role: Role): Promise<string> {
  const secret = process.env.SESSION_SECRET ?? 'dev-secret';
  const payload = btoa(JSON.stringify({ role }));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${payload}.${sigHex}`;
}

export async function verifySession(cookieValue: string): Promise<Role | null> {
  try {
    const dot = cookieValue.lastIndexOf('.');
    if (dot === -1) return null;
    const payload = cookieValue.slice(0, dot);
    const sigHex = cookieValue.slice(dot + 1);
    const secret = process.env.SESSION_SECRET ?? 'dev-secret';
    const key = await getKey(secret);
    const sigBytes = new Uint8Array((sigHex.match(/.{2}/g) ?? []).map(b => parseInt(b, 16)));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payload));
    if (!valid) return null;
    const { role } = JSON.parse(atob(payload));
    if (role === 'admin' || role === 'linecook') return role as Role;
    return null;
  } catch {
    return null;
  }
}
