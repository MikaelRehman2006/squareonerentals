// In-memory storage for verification codes (in production, use Redis or database)
export const verificationCodes = new Map<string, { 
  code: string; 
  expiresAt: number;
  createdAt: number;
  attempts: number;
}>();

// Rate limiting: track last code sent time per email
export const rateLimitMap = new Map<string, number>();

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check rate limiting (30 seconds between codes)
export function isRateLimited(email: string): boolean {
  const lastSent = rateLimitMap.get(email);
  if (!lastSent) return false;
  
  const now = Date.now();
  const timeSinceLastCode = now - lastSent;
  const thirtySeconds = 30 * 1000; // 30 seconds in milliseconds
  
  return timeSinceLastCode < thirtySeconds;
}

// Get remaining time until next code can be sent
export function getRemainingRateLimitTime(email: string): number {
  const lastSent = rateLimitMap.get(email);
  if (!lastSent) return 0;
  
  const now = Date.now();
  const timeSinceLastCode = now - lastSent;
  const thirtySeconds = 30 * 1000;
  
  const remaining = thirtySeconds - timeSinceLastCode;
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
}

// Clean up expired verification codes
export function cleanupExpiredCodes(): void {
  const now = Date.now();
  const emailsToDelete: string[] = [];
  
  verificationCodes.forEach((data, email) => {
    if (now > data.expiresAt) {
      emailsToDelete.push(email);
    }
  });
  
  emailsToDelete.forEach(email => {
    verificationCodes.delete(email);
    rateLimitMap.delete(email); // Also clean up rate limit data
  });
}

// Store verification code with rate limiting
export function storeVerificationCode(email: string, code: string): boolean {
  // Check rate limiting
  if (isRateLimited(email)) {
    return false;
  }
  
  // Clean up expired codes first
  cleanupExpiredCodes();
  
  // Generate expiration time (15 minutes from now)
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  
  // Store the verification code
  verificationCodes.set(email, {
    code,
    expiresAt,
    createdAt: Date.now(),
    attempts: 0
  });
  
  // Update rate limit tracking
  rateLimitMap.set(email, Date.now());
  
  return true;
}

// Verify code and track attempts
export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email);
  if (!stored) return false;
  
  // Check if expired
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email);
    return false;
  }
  
  // Increment attempts
  stored.attempts++;
  
  // If code matches, remove it and return true
  if (stored.code === code) {
    verificationCodes.delete(email);
    rateLimitMap.delete(email);
    return true;
  }
  
  // If too many attempts, remove the code
  if (stored.attempts >= 5) {
    verificationCodes.delete(email);
    rateLimitMap.delete(email);
  }
  
  return false;
}

// Get verification code info for debugging
export function getVerificationInfo(email: string) {
  const stored = verificationCodes.get(email);
  const rateLimit = rateLimitMap.get(email);
  
  return {
    hasCode: !!stored,
    isExpired: stored ? Date.now() > stored.expiresAt : true,
    attempts: stored?.attempts || 0,
    isRateLimited: isRateLimited(email),
    remainingRateLimitTime: getRemainingRateLimitTime(email),
    lastSent: rateLimit ? new Date(rateLimit).toISOString() : null
  };
} 