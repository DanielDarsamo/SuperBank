import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export class SecurityUtils {
  private static encryptionKey: Buffer;

  static initialize() {
    // In production, this should come from environment variables
    this.encryptionKey = crypto.scryptSync(
      process.env.ENCRYPTION_SECRET || 'default-secret-key',
      'salt',
      KEY_LENGTH
    );
  }

  // Password hashing with bcrypt
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // AES-256-GCM encryption for sensitive data
  static encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, this.encryptionKey, iv);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  static decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, this.encryptionKey, Buffer.from(encryptedData.iv, 'hex'));
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Generate secure random tokens
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate account number
  static generateAccountNumber(): string {
    const prefix = '1001'; // Bank routing prefix
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    return prefix + randomPart;
  }

  // Generate backup codes for 2FA
  static generateBackupCodes(count: number = 10): string[] {
    return Array.from({ length: count }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
  }

  // Device fingerprinting
  static generateDeviceFingerprint(userAgent: string, ip: string): string {
    const data = `${userAgent}:${ip}:${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Rate limiting token bucket
  static createRateLimitKey(identifier: string, action: string): string {
    return `rate_limit:${action}:${identifier}`;
  }

  // Secure session ID generation
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  // TOTP for 2FA (Time-based One-Time Password)
  static generateTOTPSecret(): string {
    return crypto.randomBytes(20).toString('base64');
  }

  // Validate TOTP code
  static validateTOTP(secret: string, token: string, window: number = 1): boolean {
    // Implementation would use a library like 'otplib' in production
    // This is a simplified version for demonstration
    const timeStep = Math.floor(Date.now() / 30000);
    
    for (let i = -window; i <= window; i++) {
      const expectedToken = this.generateTOTPToken(secret, timeStep + i);
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  }

  private static generateTOTPToken(secret: string, timeStep: number): string {
    // Simplified TOTP generation - use proper library in production
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
    hmac.update(Buffer.from(timeStep.toString()));
    const hash = hmac.digest();
    
    const offset = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
    
    return (code % 1000000).toString().padStart(6, '0');
  }
}

// Initialize encryption on module load
SecurityUtils.initialize();