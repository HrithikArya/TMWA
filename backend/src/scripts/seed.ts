import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({ email: { $in: ['admin@taskflow.com', 'user@taskflow.com'] } });

  await User.create([
    { name: 'Admin', email: 'admin@taskflow.com', password: 'Admin@12345', role: 'admin' },
    { name: 'User', email: 'user@taskflow.com', password: 'User@12345', role: 'user' },
  ]);

  console.log('Seeded:');
  console.log('  admin@taskflow.com / Admin@12345');
  console.log('  user@taskflow.com  / User@12345');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
