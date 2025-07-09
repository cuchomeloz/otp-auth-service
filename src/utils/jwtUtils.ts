import jwt, { SignOptions } from "jsonwebtoken";

export function generateAccessToken(payload: object): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"];

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}
