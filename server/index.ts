import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// import { startReminderScheduler } from "./notification-service";

// Environment validation function
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  log('Environment validation passed');
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
    
    // Register API routes BEFORE static/vite setup
    registerRoutes(app);
    log('Routes registered successfully');
    
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

    // Configure server port
    const port = parseInt(process.env.PORT || '5000', 10);
    
    // Start server with proper error handling
    const serverInstance = server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server successfully started on port ${port}`);
      log(`Health check available at: /health`);
      
      // Start the notification reminder scheduler - Temporarily disabled
      // startReminderScheduler();
      // log('Notification reminder scheduler started');
    });

    // Handle server startup errors
    serverInstance.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`);
      } else {
        log(`Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Setup graceful shutdown
    setupGracefulShutdown(serverInstance);
    
  } catch (error) {
    // Catch any initialization errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    log(`Application startup failed: ${errorMessage}`);
    console.error('Startup error details:', error);
    process.exit(1);
  }
})();
