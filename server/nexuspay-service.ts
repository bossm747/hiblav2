import { z } from 'zod';

// NexusPay API Configuration
const NEXUSPAY_CONFIG = {
  sandbox: {
    baseUrl: 'https://cfloenhdkulyzxijzthx.supabase.co/functions/v1/nexuspay-mock',
    environment: 'sandbox'
  },
  production: {
    baseUrl: process.env.NEXUSPAY_API_URL || '',
    environment: 'production'
  }
};

// Use sandbox by default
const isProduction = process.env.NODE_ENV === 'production' && process.env.NEXUSPAY_API_URL;
const config = isProduction ? NEXUSPAY_CONFIG.production : NEXUSPAY_CONFIG.sandbox;

// NexusPay API Types
export interface NexusPayCredentials {
  username: string;
  password: string;
}

export interface NexusPayCashInRequest {
  amount: number;
  reference: string;
  description?: string;
}

export interface NexusPayCashOutRequest {
  amount: number;
  reference: string;
  recipientAccount: string;
  description?: string;
}

export interface NexusPayResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
  status?: string;
}

// NexusPay API Service Class
export class NexusPayService {
  private csrfToken: string | null = null;
  private sessionToken: string | null = null;
  private credentials: NexusPayCredentials;

  constructor(credentials: NexusPayCredentials) {
    this.credentials = credentials;
  }

  // Step 1: Get CSRF Token
  async getCsrfToken(): Promise<string> {
    try {
      const response = await fetch(`${config.baseUrl}/csrf_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get CSRF token: ${response.status}`);
      }

      const data = await response.json();
      this.csrfToken = data.csrf_token || data.token;
      
      if (!this.csrfToken) {
        throw new Error('No CSRF token received from NexusPay API');
      }

      return this.csrfToken;
    } catch (error) {
      console.error('NexusPay CSRF Token Error:', error);
      throw new Error(`Failed to obtain CSRF token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Step 2: Login to NexusPay
  async login(): Promise<boolean> {
    try {
      if (!this.csrfToken) {
        await this.getCsrfToken();
      }

      const response = await fetch(`${config.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken!,
        },
        body: JSON.stringify({
          username: this.credentials.username,
          password: this.credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        this.sessionToken = data.session_token || data.token;
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('NexusPay Login Error:', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Step 3: Cash In (Add money to wallet)
  async cashIn(request: NexusPayCashInRequest): Promise<NexusPayResponse> {
    try {
      await this.ensureAuthenticated();

      const response = await fetch(`${config.baseUrl}/cash_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken!,
          'Authorization': `Bearer ${this.sessionToken}`,
        },
        body: JSON.stringify({
          amount: request.amount,
          reference: request.reference,
          description: request.description || `Payment for order ${request.reference}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cash in failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success || false,
        transactionId: data.transaction_id || data.transactionId,
        message: data.message,
        status: data.status,
        error: data.error
      };
    } catch (error) {
      console.error('NexusPay Cash In Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cash in failed',
      };
    }
  }

  // Cash Out (Withdraw money from wallet)
  async cashOut(request: NexusPayCashOutRequest): Promise<NexusPayResponse> {
    try {
      await this.ensureAuthenticated();

      const response = await fetch(`${config.baseUrl}/cash_out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken!,
          'Authorization': `Bearer ${this.sessionToken}`,
        },
        body: JSON.stringify({
          amount: request.amount,
          reference: request.reference,
          recipient_account: request.recipientAccount,
          description: request.description || `Refund for order ${request.reference}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cash out failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success || false,
        transactionId: data.transaction_id || data.transactionId,
        message: data.message,
        status: data.status,
        error: data.error
      };
    } catch (error) {
      console.error('NexusPay Cash Out Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cash out failed',
      };
    }
  }

  // Ensure we're authenticated before making API calls
  private async ensureAuthenticated(): Promise<void> {
    if (!this.sessionToken) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to authenticate with NexusPay');
      }
    }
  }

  // Get wallet balance (if supported by API)
  async getBalance(): Promise<{ balance: number; currency: string } | null> {
    try {
      await this.ensureAuthenticated();

      const response = await fetch(`${config.baseUrl}/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken!,
          'Authorization': `Bearer ${this.sessionToken}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        balance: data.balance || 0,
        currency: data.currency || 'PHP'
      };
    } catch (error) {
      console.error('NexusPay Balance Error:', error);
      return null;
    }
  }

  // Transaction status check
  async getTransactionStatus(transactionId: string): Promise<NexusPayResponse> {
    try {
      await this.ensureAuthenticated();

      const response = await fetch(`${config.baseUrl}/transaction/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken!,
          'Authorization': `Bearer ${this.sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success || false,
        transactionId: data.transaction_id || data.transactionId,
        message: data.message,
        status: data.status,
        error: data.error
      };
    } catch (error) {
      console.error('NexusPay Transaction Status Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction status',
      };
    }
  }
}

// Helper function to create NexusPay service instance
export function createNexusPayService(): NexusPayService {
  const credentials: NexusPayCredentials = {
    username: process.env.NEXUSPAY_USERNAME || 'sandbox_user',
    password: process.env.NEXUSPAY_PASSWORD || 'sandbox_pass'
  };

  return new NexusPayService(credentials);
}

// Test function for sandbox
export async function testNexusPayConnection(): Promise<boolean> {
  try {
    const service = createNexusPayService();
    await service.getCsrfToken();
    console.log('NexusPay sandbox connection successful');
    return true;
  } catch (error) {
    console.error('NexusPay sandbox connection failed:', error);
    return false;
  }
}