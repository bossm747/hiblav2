import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// import { startReminderScheduler } from "./notification-service";
import { seedHiblaAssets } from './seed-hibla-assets';
import { seedStaff } from './seed-staff';
import { seedDefaultStaff } from './seed-default-staff';
import { seedWarehouses } from './seed-warehouses';
import { seedShowcasePricing } from './seed-showcase-pricing';
import { cleanCustomerData as seedRealCustomersOnly } from './seed-real-customers-only';
import { seedRealHiblaData } from './seed-real-hibla-data';
import path from 'path'; // Ensure path is imported


// Environment validation function
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  log('Environment validation passed');
}

// Async seeding function to run separately from server startup
async function seedDataAsync() {
  try {
    if (process.env.DATABASE_URL) {
      log('🌱 Starting background data seeding...');

      // Run seeding operations with timeout to prevent blocking
      const seedingPromise = Promise.all([
        seedWarehouses(),
        seedShowcasePricing(),
        seedStaff(),
        seedDefaultStaff()
      ]);

      // Set a timeout for seeding operations
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Seeding timeout')), 30000)
      );

      await Promise.race([seedingPromise, timeoutPromise]);
      log('✅ Background data seeding completed');
    } else {
      log('⚠️ No database URL found, skipping seeding');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown seeding error';
    log(`⚠️ Background data seeding failed: ${errorMessage}`);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Seeding error details:', error);
    }
    log('Server continues running without seeded data');
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Graceful shutdown handling
function setupGracefulShutdown(server: any) {
  const shutdown = (signal: string) => {
    log(`Received ${signal}, shutting down gracefully`);
    server.close(() => {
      log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Main application startup with comprehensive error handling
(async () => {
  try {
    // Validate environment variables first
    validateEnvironment();

    // Deployment health status tracking

    // Fast health check routes (must be before other routes)
    app.get('/health', (req, res) => {
      // Simple, fast response for deployment health checks
      res.status(200).send('OK');
    });

    app.get('/api/health', (req, res) => {
      // Set response timeout to ensure quick response
      res.setTimeout(5000, () => {
        res.status(408).send('Health check timeout');
      });
      
      // Simple health check response
      res.status(200).send('OK');
    });
    log('Health check routes registered');

    // Create HTTP server
    const server = createServer(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    // Register API routes first
    registerRoutes(app);
    log('API routes registered');

    // Setup development or production environment
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log('Development environment with Vite setup complete');
    } else {
      serveStatic(app);
      log('Production environment with static files setup complete');
    }

    // Configure server port with proper fallback handling
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = '0.0.0.0'; // Explicitly define host for consistency

    // Start server with explicit binding for Cloud Run
    const serverInstance = server.listen(port, '0.0.0.0', async () => {
      log(`🚀 Hibla Manufacturing System started successfully`);
      log(`📡 Server listening on port ${port} (host: ${host})`);
      log(`🏥 Health checks available at:`);
      log(`   GET http://${host}:${port}/health`);
      log(`   GET http://${host}:${port}/api/health`);
      log(`🌐 React application available at:`);
      log(`   GET http://${host}:${port}/ (Hibla Manufacturing System)`);
      log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

      // Mark as deployment ready immediately for health checks
      log(`✅ Server is ready to accept connections`);

      // Initialize data in background with proper delay
      setTimeout(() => {
        log('Starting delayed initialization...');
        seedDataAsync().catch(err => {
          log('Seeding error (non-fatal):', err.message);
        });
      }, 3000); // 3 second delay after "Server is ready" message
    });

    // Handle server startup errors
    serverInstance.on('error', (error: any) => {
      log(`Server error: ${error.message}`);
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`);
        process.exit(1);
      }
    });

    // Keep the process alive and handle unhandled errors
    process.on('uncaughtException', (error) => {
      log(`Uncaught Exception: ${error.message}`);
      console.error('Uncaught Exception details:', error);
      // Don't exit on uncaught exceptions in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    process.on('unhandledRejection', (reason, promise) => {
      log(`Unhandled Rejection at ${promise}, reason: ${reason}`);
      console.error('Unhandled Rejection details:', reason);
      // Don't exit on unhandled rejections in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    // Ensure process stays running for deployment
    process.on('SIGTERM', () => {
      log('SIGTERM received, shutting down gracefully');
      serverInstance.close(() => {
        log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      log('SIGINT received, shutting down gracefully');
      serverInstance.close(() => {
        log('Process terminated');
      });
    });

    // Keep process alive with periodic heartbeat
    const heartbeatInterval = setInterval(() => {
      // Periodic heartbeat to keep process alive
      if (serverInstance && serverInstance.listening) {
        log(`Server heartbeat - Active connections: ${serverInstance.listening}`);
      }
    }, 60000); // Every minute
    
    // Prevent process from exiting
    heartbeatInterval.ref();

  } catch (error) {
    // Catch any initialization errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    log(`❌ Application startup failed: ${errorMessage}`);
    console.error('Startup error details:', error);
    process.exit(1);
  }
})();