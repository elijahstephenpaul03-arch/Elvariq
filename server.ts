import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/api.ts';
import { seedDatabase } from './src/server/seed.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // API router mounted first
  app.use('/api', apiRouter);

  // Auto-seed database with baseline records if empty
  try {
    const seedResult = await seedDatabase(false);
    console.log('[ELVARIQ DB]:', seedResult.message);
  } catch (err) {
    console.warn('[ELVARIQ DB] Warning during initial seed check:', err);
  }

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ELVARIQ Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ELVARIQ Server] Startup failed:', err);
});
