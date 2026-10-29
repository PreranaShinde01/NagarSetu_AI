import mongoose from 'mongoose';
import { env } from './env.js';

let dbConnected = false;

export async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    
    console.log(`[DATABASE] Connecting to MongoDB at ${env.MONGODB_URI}...`);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout fast if MongoDB is unavailable
    });

    dbConnected = true;
    console.log(`[DATABASE] Connected successfully to MongoDB: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DATABASE] Runtime Mongoose Connection Error:', err.message);
      dbConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DATABASE] Mongoose disconnected from MongoDB.');
      dbConnected = false;
    });

    return conn;
  } catch (error) {
    dbConnected = false;
    console.error(`[DATABASE CRITICAL ERROR] Could not connect to MongoDB: ${error.message}`);
    console.error(`[DATABASE HINT] Ensure MongoDB is running locally or verify MONGODB_URI in .env`);
    // Do not throw fatal error during boot so server can still serve 503 health state
    return null;
  }
}

export function isDbConnected() {
  return dbConnected && mongoose.connection.readyState === 1;
}

export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    dbConnected = false;
    console.log('[DATABASE] Mongoose connection closed gracefully.');
  }
}

// Handle OS termination signals
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});
