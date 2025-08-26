import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { productionConfig } from "./config/production";

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

      // Generate JWT token with production configuration
      const token = jwt.sign(
        { 
          id: staff.id, 
          email: staff.email, 
          role: staff.role,
          permissions: staff.permissions 
        },
        productionConfig.auth.jwtSecret,
        { expiresIn: productionConfig.auth.jwtExpiresIn as string | number }
      );
      
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
        staffData.password = await bcrypt.hash(staffData.password, productionConfig.auth.bcryptRounds);
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
    try {
      const decoded = jwt.verify(token, productionConfig.auth.jwtSecret);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }

  async getStaffByToken(token: string) {
    try {
      const decoded = jwt.verify(token, productionConfig.auth.jwtSecret) as any;
      
      if (!decoded || !decoded.id) {
        return null;
      }
      
      return await storage.getStaffById(decoded.id);
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();