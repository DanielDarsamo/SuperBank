import { SecurityAuditLog } from '@/types/security';

export class AuditLogger {
  private static logs: SecurityAuditLog[] = [];

  static async log(
    userId: string,
    action: string,
    details: Record<string, any>,
    request: {
      ip: string;
      userAgent: string;
    },
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    const auditLog: SecurityAuditLog = {
      id: crypto.randomUUID(),
      userId,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        sessionId: details.sessionId || 'unknown'
      },
      ipAddress: request.ip,
      userAgent: request.userAgent,
      timestamp: new Date().toISOString(),
      riskLevel
    };

    // In production, this would be stored in a secure database
    this.logs.push(auditLog);

    // Alert on high-risk activities
    if (riskLevel === 'high' || riskLevel === 'critical') {
      await this.alertSecurityTeam(auditLog);
    }

    console.log(`[AUDIT] ${riskLevel.toUpperCase()}: ${action}`, auditLog);
  }

  private static async alertSecurityTeam(log: SecurityAuditLog): Promise<void> {
    // In production, this would send alerts to security team
    console.warn('[SECURITY ALERT]', {
      userId: log.userId,
      action: log.action,
      riskLevel: log.riskLevel,
      timestamp: log.timestamp,
      details: log.details
    });
  }

  static async getUserAuditLogs(userId: string, limit: number = 50): Promise<SecurityAuditLog[]> {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static async getHighRiskLogs(hours: number = 24): Promise<SecurityAuditLog[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.logs
      .filter(log => 
        new Date(log.timestamp) > cutoff && 
        (log.riskLevel === 'high' || log.riskLevel === 'critical')
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Common audit actions
  static async logLogin(userId: string, success: boolean, request: any): Promise<void> {
    await this.log(
      userId,
      success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      { success, loginMethod: '2fa' },
      request,
      success ? 'low' : 'medium'
    );
  }

  static async logTransaction(userId: string, transactionId: string, amount: number, request: any): Promise<void> {
    const riskLevel = amount > 10000 ? 'high' : amount > 1000 ? 'medium' : 'low';
    await this.log(
      userId,
      'TRANSACTION_INITIATED',
      { transactionId, amount, currency: 'MT' },
      request,
      riskLevel
    );
  }

  static async logPasswordChange(userId: string, request: any): Promise<void> {
    await this.log(
      userId,
      'PASSWORD_CHANGED',
      { method: '2fa_verified' },
      request,
      'medium'
    );
  }

  static async logAccountLockout(userId: string, reason: string, request: any): Promise<void> {
    await this.log(
      userId,
      'ACCOUNT_LOCKED',
      { reason, lockoutDuration: '30_minutes' },
      request,
      'high'
    );
  }

  static async logSuspiciousActivity(userId: string, activity: string, request: any): Promise<void> {
    await this.log(
      userId,
      'SUSPICIOUS_ACTIVITY',
      { activity, requiresReview: true },
      request,
      'critical'
    );
  }
}