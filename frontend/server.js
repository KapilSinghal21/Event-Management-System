import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import compression from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = "http://54.158.13.94:5050";

app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
  })
);

app.use(
  "/uploads",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
  })
);
app.use(
  "/poster-",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
  })
);
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5050", // backend
    changeOrigin: true,
  })
);
app.use(compression());
app.use(express.static(join(__dirname, "dist"), { maxAge: "1d" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ⭐ THIS IS THE FIX — EXPRESS 5 COMPATIBLE WILDCARD
app.get(/.*/, (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on http://0.0.0.0:${PORT}`);
});
