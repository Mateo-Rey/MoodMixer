import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import { authFunctions } from "./routes/auth.js";
import { spotifyFunctions } from "./routes/spotifyFunctions.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5123;

/* ──────────────────── MIDDLEWARE ──────────────────── */
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

/* ──────────────────── HEALTH CHECK ──────────────────── */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Spotify Mood API running 🎧",
  });
});

/* ──────────────────── AUTH ROUTES (PLACEHOLDER) ──────────────────── */
// Later: Spotify OAuth login & callback
app.get("/auth/login", authFunctions.spotifyLogin);

app.get("/auth/callback", authFunctions.callback);


/* ──────────────────── SERVICE ROUTES (PLACEHOLDER) ──────────────────── */

app.post("/service/spotifySearch", spotifyFunctions.searchSpotify)

/* ──────────────────── RECOMMENDATIONS (PLACEHOLDER) ──────────────────── */
app.post("/recommendations", async (req, res) => {
  const { mood, intensity } = req.body;

  // TODO:
  // 1. Get user access token
  // 2. Fetch top tracks / recent tracks
  // 3. Call Spotify recommendations endpoint
  // 4. Score + filter tracks

  res.json({
    mood,
    intensity,
    recommendations: [],
  });
});

/* ──────────────────── ERROR HANDLER ──────────────────── */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ──────────────────── START SERVER ──────────────────── */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});