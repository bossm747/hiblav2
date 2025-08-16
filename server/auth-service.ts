import { storage } from "./storage";
import bcrypt from "bcrypt";
import { z } from "zod";

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions?: string[];
  };
  token?: string;
}

class AuthService {
  async authenticate(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting authentication for email:', email);
      
      // Get staff member by email
      const staff = await storage.getStaffByEmail(email);
      console.log('Staff lookup result:', staff ? 'found' : 'not found');
      
      if (!staff) {
        console.log('No staff found with email:', email);
        return {
          success: false,
          message: "Invalid credentials"
        };
      }

      console.log('Staff found:', { id: staff.id, email: staff.email, role: staff.role });

      // Check password using bcrypt
      const isValid = await bcrypt.compare(password, staff.password);
      console.log('Password validation:', isValid ? 'valid' : 'invalid');
      
      if (!isValid) {
        console.log('Invalid password for user:', email);
        return {
          success: false,
          message: "Invalid credentials"
        };
      }

      // Generate token (in production, use JWT)
      const token = `demo-token-${staff.id}-${Date.now()}`;
      
      console.log('Authentication successful for:', email);
      return {
        success: true,
        user: {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role,
          permissions: staff.permissions as string[]
        },
        token
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: "Authentication failed"
      };
    }
  }

  async createStaff(staffData: any) {
    try {
      // Hash the password before storing
      if (staffData.password) {
        staffData.password = await bcrypt.hash(staffData.password, 10);
      }
      
      return await storage.createStaff(staffData);
    } catch (error) {
      console.error('Create staff error:', error);
      throw error;
    }
  }

  async updateStaffPermissions(staffId: string, permissions: string[]) {
    try {
      const staff = await storage.getStaffById(staffId);
      if (!staff) {
        throw new Error("Staff not found");
      }
      
      return await storage.updateStaff(staffId, { permissions });
    } catch (error) {
      console.error('Update permissions error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    // Simple token validation for development
    // In production, verify JWT token
    return !!(token && token.startsWith('demo-token-'));
  }

  async getStaffByToken(token: string) {
    // Extract staff ID from token (development only)
    // In production, decode JWT to get user info
    if (!token || !token.startsWith('demo-token-')) {
      return null;
    }
    
    const parts = token.split('-');
    if (parts.length < 3) {
      return null;
    }
    
    const staffId = parts[2];
    return await storage.getStaffById(staffId);
  }
}

export const authService = new AuthService();