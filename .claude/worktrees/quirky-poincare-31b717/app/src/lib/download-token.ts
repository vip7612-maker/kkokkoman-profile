import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

const ENC = new TextEncoder().encode(env.sessionSecret.padEnd(32, "x"));

export async function issueDownloadToken(fileId: number) {
  return await new SignJWT({ fileId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(ENC);
}

export async function verifyDownloadToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ENC);
    if (typeof payload.fileId !== "number") return null;
    return { fileId: payload.fileId };
  } catch {
    return null;
  }
}
