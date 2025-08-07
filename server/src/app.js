// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminAuthRoutes from './routes/adminAuth.js';
import designRoutes from './routes/design.js';
import { main } from './database/database.js';
import uploadsRoutes from './routes/uploads.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body parser
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────

// Auth routes
app.use('/api/auth', authRoutes); 
// Admin auth routes (if you need separate admin flows)
app.use('/api/auth/admin', adminAuthRoutes);

// Design CRUD routes (protected inside router)
app.use('/api/designs', designRoutes);  

app.use('/api/uploads', uploadsRoutes);

// Health-check
app.get('/', (req, res) => {
  res.json({ activeStatus: true, error: false });
});

// ─── ERROR HANDLER ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(err.status || 500).json({ message: err.message });
});

// ─── DATABASE CONNECTION ──────────────────────────────────────
main().catch(err => console.error('❌ DB connection failed', err));

// ─── SERVER STARTUP ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

// Export app for serverless/production (e.g. Vercel/Lambda)
export default app;
