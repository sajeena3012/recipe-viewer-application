import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If no MongoDB URI is provided, return fallback mode
  if (!MONGODB_URI) {
    console.log('No MongoDB URI provided - using fallback mode');
    return { fallback: true };
  }

  // If already connected, return the cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        cached.promise = null;
        // Return fallback mode instead of throwing
        return { fallback: true };
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    // Return fallback mode instead of throwing
    return { fallback: true };
  }
}

export default dbConnect;