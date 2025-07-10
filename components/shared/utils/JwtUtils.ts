import jwt from "jsonwebtoken";

import { JwtUserPayload } from "@/interfaces";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;
const JWT_EXPIRES_IN = "1h";

export class JwtUtils {
  static createToken(payload: JwtUserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtUserPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    } catch {
      return null;
    }
  }

  static decodeToken(token: string): JwtUserPayload | null {
    try {
      return jwt.decode(token) as JwtUserPayload;
    } catch {
      return null;
    }
  }

  static isTokenValid(token: string): boolean {
    const decoded = this.verifyToken(token);

    if (!decoded) return false;

    const currentTime = Math.floor(Date.now() / 1000);

    return !decoded.exp || decoded.exp > currentTime;
  }
}
