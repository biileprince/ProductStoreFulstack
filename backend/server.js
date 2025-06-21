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

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 1) JSON body parser
app.use(express.json());

// 2) CORS – include OPTIONS, allow your Vite origin and static files
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);



app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

// 4) file‑upload
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: false,
  })
);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// 6) Arcjet (we skip it for POST/PUT on /api/products so images still land)
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api/products") && ["POST","PUT"].includes(req.method)) {
    return next();
  }
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      const status = decision.reason.isRateLimit() ? 429 : 403;
      const msg = decision.reason.isRateLimit()
        ? "Too Many Requests"
        : decision.reason.isBot()
          ? "Bot access denied"
          : "Forbidden";
      return res.status(status).json({ error: msg });
    }
    next();
  } catch (err) {
    console.error("Arcjet error", err);
    next(err);
  }
});



// 7) your API routes
app.use("/api/products", productRoutes);

// 8) initialize DB & start server
async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id         SERIAL       PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      image      VARCHAR(255) NOT NULL,
      price      DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("Database initialized.");
}

initDB()
  .then(() =>
    app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`))
  )
  .catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
  });
