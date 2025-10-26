import { MongoClient } from 'mongodb';

// Don't throw error if MONGODB_URI is missing, just log it
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is not set. Database features will be disabled.');
  console.warn('   Add MONGODB_URI to your environment variables to enable database.');
}

const uri = process.env.MONGODB_URI || '';
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
  connectTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Create a dummy promise that will always reject
  clientPromise = Promise.reject(new Error('MongoDB URI not configured'));
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch((error) => {
      console.error('MongoDB connection error:', error.message);
      throw error;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error('MongoDB connection error in production:', error.message);
    throw error;
  });
}

export default clientPromise;

