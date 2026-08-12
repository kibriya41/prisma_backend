import express from "express";
import cors from "cors";
import routes from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Marketplace API is running 🚀" });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;