import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  const indexPath = path.resolve(distPath, "index.html");

  log(`Static files path: ${distPath}`);
  log(`Index file path: ${indexPath}`);
  log(`Index file exists: ${fs.existsSync(indexPath)}`);

  // Serve static files from dist/public with proper headers
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: false
  }));

  // Handle client-side routing - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes and health checks
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }

    // Check if file exists in static directory
    const filePath = path.join(distPath, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }

    // Fallback to index.html for client-side routing
    if (fs.existsSync(indexPath)) {
      log(`Serving index.html for route: ${req.path}`);
      res.sendFile(indexPath);
    } else {
      log(`Production build not found at ${indexPath}`);
      res.status(404).send("Production build not found. Run 'npm run build' first.");
    }
  });
}