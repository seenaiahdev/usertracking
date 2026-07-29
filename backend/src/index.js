// Express app entry point — registers middleware, routes, and starts server
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import supabaseAdmin from "./config/supabaseAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);

    const { error } = await supabaseAdmin.from("video_progress").select("id").limit(1);
    if (error) {
      console.error("❌ Supabase connection issue:", error.message);
      console.error("   → Make sure you ran backend/schema.sql in your Supabase SQL editor!");
    } else {
      console.log("✅ Supabase connected — tables found.");
    }
  });
}

export default app;
