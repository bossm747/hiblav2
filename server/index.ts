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


// Environment validation function
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  log('Environment validation passed');
}

// Async seeding function to run after server startup
async function seedDataAsync() {
  // Use setTimeout with longer delay to ensure server is fully ready
  setTimeout(async () => {
    try {
      // Test database connection first
      if (process.env.DATABASE_URL) {
        await seedWarehouses();
        await seedShowcasePricing();
        await seedStaff();
        await seedDefaultStaff();
        log('✅ Background data seeding completed');
      } else {
        log('⚠️ No database URL found, skipping seeding');
      }
    } catch (error) {
      // Don't fail the server if seeding fails
      const errorMessage = error instanceof Error ? error.message : 'Unknown seeding error';
      log(`⚠️ Background data seeding failed: ${errorMessage}`);
      // Only log details in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Seeding error details:', error);
      }
      log('Server continues running without seeded data');
    }
  }, 2000); // Longer delay to ensure server is fully ready
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

    // Register API routes BEFORE static/vite setup (includes health check endpoints)
    registerRoutes(app);
    log('Routes registered successfully (including health endpoints)');

    // Create HTTP server
    const server = createServer(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    // Setup development or production environment
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log('Development environment with Vite setup complete');
    } else {
      serveStatic(app);
      log('Production environment with static files setup complete');
    }

    // Start server first, then seed data asynchronously
    // This ensures health checks work immediately while seeding runs in background


    // Configure server port with proper fallback handling
    const port = parseInt(process.env.PORT || '5000', 10);

    // Start server with improved error handling
    const startServer = () => {
      return new Promise((resolve, reject) => {
        const serverInstance = server.listen({
          port: port,
          host: "0.0.0.0",
        }, async () => {
          log(`🚀 Hibla Manufacturing System started successfully`);
          log(`📡 Server listening on port ${port} (host: 0.0.0.0)`);
          
          // Wait for server to fully initialize before declaring ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          log(`🏥 Health checks available at:`);
          log(`   GET http://0.0.0.0:${port}/ (root health check for deployment)`);
          log(`   GET http://0.0.0.0:${port}/health`);
          log(`   GET http://0.0.0.0:${port}/api/health`);
          log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
          log(`✅ Server is ready to accept connections`);

          // Start the notification reminder scheduler - Temporarily disabled
          // startReminderScheduler();
          // log('Notification reminder scheduler started');

          // Setup graceful shutdown
          setupGracefulShutdown(serverInstance);

          // Keep the process alive
          log('🔄 Process will stay alive to serve requests');
          
          // Start data seeding asynchronously after server is running
          seedDataAsync();
          
          resolve(serverInstance);
        });

        // Handle server startup errors
        serverInstance.on('error', (error: any) => {
          log(`Server error: ${error.message}`);
          reject(error);
        });
      });
    };

    // Start the server and handle global errors
    await startServer();

    // Keep the process alive with a simple interval
    setInterval(() => {
      // This ensures the event loop stays active
      // No-op function that runs every 60 seconds
    }, 60000);

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

  } catch (error) {
    // Catch any initialization errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    log(`❌ Application startup failed: ${errorMessage}`);
    console.error('Startup error details:', error);
    process.exit(1);
  }
})();