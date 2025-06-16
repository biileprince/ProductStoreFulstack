import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Apply security middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  abortOnLimit: true,
  useTempFiles: false,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Arcjet protection (skip for file uploads)
app.use(async (req, res, next) => {
  if (req.path.includes('/api/products') && (req.method === 'POST' || req.method === 'PUT')) {
    return next();
  }
  
  try {
    const decision = await aj.protect(req, { requested: 1 });
    
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    if (decision.results.some(r => r.reason.isBot() && r.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet error", error);
    next(error);
  }
});

// Routes
app.use("/api/products", productRoutes);

// Database initialization
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id          SERIAL      PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        image       VARCHAR(255) NOT NULL,
        price       DECIMAL(10,2) NOT NULL,
        created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

// Start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Server failed to start:", err);
  process.exit(1);
});