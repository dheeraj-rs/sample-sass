import crypto from 'crypto';

/**
 * Generate 6-digit 2FA code
 */
export function generate2FACode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Get 2FA code expiry time (10 minutes from now)
 */
export function get2FAExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}

/**
 * Verify if 2FA code is valid and not expired
 */
export function verify2FACode(
  providedCode: string,
  storedCode: string,
  expiry: Date
): boolean {
  if (new Date() > expiry) {
    return false;
  }
  return providedCode === storedCode;
}
