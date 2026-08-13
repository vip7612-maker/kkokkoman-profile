import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "./env";

const ENC = new TextEncoder().encode(env.sessionSecret.padEnd(32, "x"));
const COOKIE = "kkokko_admin";

export async function signSession(payload: { email: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ENC);
  return token;
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, ENC);
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getCurrentAdmin() {
  const c = await cookies();
  const tok = c.get(COOKIE)?.value;
  if (!tok) return null;
  return await verifySession(tok);
}

export const SESSION_COOKIE = COOKIE;
