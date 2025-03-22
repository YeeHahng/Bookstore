import crypto from 'crypto';

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate that a token matches the expected value
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  // Use constant-time comparison to prevent timing attacks
  if (!token || !expectedToken) return false;
  
  // Simple constant-time comparison
  let valid = true;
  if (token.length !== expectedToken.length) return false;
  
  for (let i = 0; i < token.length; i++) {
    valid = valid && (token[i] === expectedToken[i]);
  }
  
  return valid;
}