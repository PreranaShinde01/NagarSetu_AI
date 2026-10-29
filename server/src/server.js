import app from './app.js';
import { env, validateEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function startServer() {
  validateEnv();
  
  console.log('----------------------------------------------------');
  console.log('  NAGARSETU AI - CIVIC OPERATIONS REST API SERVER   ');
  console.log('  Tagline: "Connecting Citizens. Empowering Governance."');
  console.log('----------------------------------------------------');

  // Connect to MongoDB
  await connectDatabase();

  const PORT = env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[SERVER] Express server listening on http://localhost:${PORT}`);
    console.log(`[SERVER] Health check URL: http://localhost:${PORT}/api/v1/health`);
    console.log(`[SERVER] Environment: ${env.NODE_ENV}`);
    console.log('----------------------------------------------------');
  });
}

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
