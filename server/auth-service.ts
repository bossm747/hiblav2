import { db } from './db';
import { staff, customers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { PERMISSIONS, getPermissionsByRole, type Permission } from '@shared/permissions';

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
  // For demo purposes, using simple encoding
  // In production, use bcrypt.hash(password, 10)
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  // For demo purposes, using simple encoding
  // In production, use bcrypt.compare(password, hashedPassword)
  return Buffer.from(password).toString('base64') === hashedPassword;
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
  type: 'staff' | 'customer';
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  message: string;
  token?: string;
}

export class AuthService {
  // Staff authentication
  async authenticateStaff(email: string, password: string): Promise<LoginResult> {
    try {
      const [staffMember] = await db
        .select()
        .from(staff)
        .where(eq(staff.email, email))
        .limit(1);

      if (!staffMember) {
        return { success: false, message: 'Invalid email or password' };
      }

      if (!staffMember.isActive) {
        return { success: false, message: 'Account is deactivated. Please contact administrator.' };
      }

      // Verify password (using simple comparison for now)
      const isValidPassword = staffMember.password === password;
      
      if (!isValidPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Update last login
      await db
        .update(staff)
        .set({ lastLogin: new Date() })
        .where(eq(staff.id, staffMember.id));

      // Get permissions (from database or role defaults)
      const dbPermissions = staffMember.permissions || [];
      const rolePermissions = getPermissionsByRole(staffMember.role);
      const allPermissions = [...new Set([...dbPermissions, ...rolePermissions])];

      const authUser: AuthUser = {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        permissions: allPermissions as Permission[],
        type: 'staff'
      };

      // Generate token (simplified for demo)
      const token = this.generateToken(authUser);

      return {
        success: true,
        user: authUser,
        message: 'Login successful',
        token
      };
    } catch (error) {
      console.error('Staff authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // Customer authentication  
  async authenticateCustomer(email: string, password: string): Promise<LoginResult> {
    try {
      const [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (!customer) {
        return { success: false, message: 'Invalid email or password' };
      }

      if (customer.status !== 'active') {
        return { success: false, message: 'Account is not active. Please contact support.' };
      }

      // Verify password (using simple comparison for now)
      const isValidPassword = customer.password === password;
      
      if (!isValidPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      const authUser: AuthUser = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: 'customer',
        permissions: [PERMISSIONS.CUSTOMERS_PORTAL_ACCESS], // Customers have limited portal access
        type: 'customer'
      };

      // Generate token (simplified for demo)
      const token = this.generateToken(authUser);

      return {
        success: true,
        user: authUser,
        message: 'Login successful',
        token
      };
    } catch (error) {
      console.error('Customer authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // Universal authentication (tries both staff and customer)
  async authenticate(email: string, password: string): Promise<LoginResult> {
    // Try staff authentication first
    const staffResult = await this.authenticateStaff(email, password);
    if (staffResult.success) {
      return staffResult;
    }

    // Try customer authentication
    const customerResult = await this.authenticateCustomer(email, password);
    if (customerResult.success) {
      return customerResult;
    }

    return { success: false, message: 'Invalid email or password' };
  }

  // Create staff member with hashed password
  async createStaff(staffData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    permissions?: Permission[];
  }) {
    const hashedPassword = hashPassword(staffData.password);
    
    const [newStaff] = await db.insert(staff).values({
      ...staffData,
      password: hashedPassword,
      permissions: staffData.permissions || getPermissionsByRole(staffData.role),
    }).returning();

    return newStaff;
  }

  // Update staff permissions
  async updateStaffPermissions(staffId: string, permissions: Permission[]) {
    const [updated] = await db
      .update(staff)
      .set({ permissions })
      .where(eq(staff.id, staffId))
      .returning();

    return updated;
  }

  // Token management (simplified for demo)
  private generateToken(user: AuthUser): string {
    // In production, use JWT with proper signing
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: user.type,
      timestamp: Date.now()
    };
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  validateToken(token: string): AuthUser | null {
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired (24 hours)
      const isExpired = Date.now() - tokenData.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        return null;
      }

      // In production, verify JWT signature
      return tokenData as AuthUser;
    } catch {
      return null;
    }
  }

  // Check if user has specific permission
  hasPermission(user: AuthUser, permission: Permission): boolean {
    return user.permissions.includes(permission);
  }

  // Check if user has any of the required permissions
  hasAnyPermission(user: AuthUser, permissions: Permission[]): boolean {
    return permissions.some(permission => user.permissions.includes(permission));
  }
}

export const authService = new AuthService();