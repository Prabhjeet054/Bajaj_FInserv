import "dotenv/config";
import express from "express";
import cors from "cors";
import { processData } from "./processor.js";

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
  "https://bajaj-f-inserv.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://localhost:5173",
  "https://127.0.0.1:5173"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.options("*", cors());

app.get("/bfhl", (_req, res) => {
  res.status(200).json({ status: "ok", message: "BFHL API is running" });
});

app.post("/bfhl", (req, res) => {
  try {
    if (!req.body || req.body === null) {
      return res.status(400).json({
        error: true,
        message: "Request body is missing or not valid JSON"
      });
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, "data")) {
      return res.status(400).json({
        error: true,
        message: "'data' key is missing from request body"
      });
    }

    if (!Array.isArray(req.body.data)) {
      return res.status(400).json({
        error: true,
        message: "'data' must be an array of strings"
      });
    }

    const result = processData(req.body.data);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in POST /bfhl:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`BFHL API running at http://localhost:${PORT}`);
});
