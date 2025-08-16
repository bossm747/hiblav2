// Production configuration - all settings for live deployment
export const productionConfig = {
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    ssl: process.env.NODE_ENV === 'production',
  },
  
  // Authentication & Security
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'hibla-manufacturing-secret-key-2025',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    sessionSecret: process.env.SESSION_SECRET || 'hibla-manufacturing-session-secret-2025',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  },
  
  // Session
  session: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || String(24 * 60 * 60 * 1000)), // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
  },
  
  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['https://hibla.com', 'https://www.hibla.com'],
    credentials: true,
  },
  
  // Rate Limiting
  rateLimiting: {
    api: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || String(15 * 60 * 1000)), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
    auth: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || String(15 * 60 * 1000)), // 15 minutes
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
    },
  },
  
  // Email (for production notifications)
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@hibla.com',
  },
  
  // Object Storage (if using cloud storage)
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    bucket: process.env.STORAGE_BUCKET || 'hibla-files',
    region: process.env.STORAGE_REGION || 'us-west-2',
    accessKey: process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.STORAGE_SECRET_KEY || '',
  },
  
  // Application
  app: {
    port: parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'production',
    logLevel: process.env.LOG_LEVEL || 'info',
    trustProxy: process.env.TRUST_PROXY === 'true',
  },
  
  // Features flags
  features: {
    enablePayments: process.env.ENABLE_PAYMENTS === 'true',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    enableAI: process.env.ENABLE_AI === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
};

// Validate required configurations
export function validateProductionConfig() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required production environment variables: ${missing.join(', ')}`);
    console.error('Please set these in your environment or .env file');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot start in production without required environment variables');
    }
  }
  
  // Warn about using defaults in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: Using default JWT secret in production is insecure!');
    }
    if (!process.env.SESSION_SECRET) {
      console.warn('WARNING: Using default session secret in production is insecure!');
    }
  }
}