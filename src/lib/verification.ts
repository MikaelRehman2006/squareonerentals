// In-memory storage for verification codes (in production, use Redis or database)
export const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
  });
} 