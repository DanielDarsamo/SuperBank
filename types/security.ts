export interface SecurityConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
  };
  sessionConfig: {
    timeoutMinutes: number;
    maxConcurrentSessions: number;
    requireReauthForSensitive: boolean;
  };
  accountLockout: {
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
    timeWindowMinutes: number;
  };
  twoFactorAuth: {
    required: boolean;
    methods: ('sms' | 'email' | 'authenticator')[];
    backupCodes: number;
  };
}

export interface UserProfile {
  id: string;
  accountNumber: string;
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    governmentId: {
      type: 'passport' | 'drivers_license' | 'national_id';
      number: string;
      expiryDate: string;
    };
  };
  contactInfo: {
    email: string;
    emailVerified: boolean;
    phone: string;
    phoneVerified: boolean;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      proofOfResidence?: string; // document URL
    };
  };
  credentials: {
    username: string;
    passwordHash: string;
    passwordLastChanged: string;
    twoFactorEnabled: boolean;
    twoFactorMethod: 'sms' | 'email' | 'authenticator';
    backupCodes: string[];
  };
  security: {
    lastLogin: string;
    failedLoginAttempts: number;
    accountLocked: boolean;
    lockoutUntil?: string;
    sessionId?: string;
    lastActivity: string;
  };
  preferences: {
    language: 'en' | 'pt';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    transactionLimits: {
      dailyLimit: number;
      monthlyLimit: number;
      singleTransactionLimit: number;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface TransactionSecurity {
  id: string;
  userId: string;
  transactionId: string;
  authMethod: '2fa' | 'biometric' | 'pin';
  ipAddress: string;
  deviceFingerprint: string;
  riskScore: number;
  approved: boolean;
  timestamp: string;
}