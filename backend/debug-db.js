import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';

console.log('Running database connection test...');
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'Loaded' : 'Not Loaded'}`);

const runTest = async () => {
  const connected = await connectDB();
  if (connected) {
    console.log('✅✅✅ Database connection successful! ✅✅✅');
    process.exit(0);
  } else {
    console.log('❌❌❌ Database connection failed. ❌❌❌');
    process.exit(1);
  }
};

runTest();
