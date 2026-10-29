import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nagarsetu_ai';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB at', MONGODB_URI);

  const Municipality = mongoose.model('Municipality', new mongoose.Schema({}, { strict: false }));
  const result = await Municipality.updateMany({ code: { $ne: 'IMC' } }, { $set: { isActive: false } });
  console.log(`Deactivated non-IMC municipalities: ${result.modifiedCount}`);

  const active = await Municipality.find({ isActive: true });
  console.log('Active municipalities now:', active.map((m) => `${m.name} (${m.code})`));

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
