import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/urekha";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") { 
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  console.log("Initializing MongoDB connection in production...");

  client = new MongoClient(uri, options);
  // Delay the connect() call until it is actually imported / needed when possible, but for standard Next.js cache
  clientPromise = client.connect().catch((err) => {
    console.error(
      "CRITICAL: MongoDB connection failed in production:",
      err.message,
    );
    throw err; // Re-throw to fail fast if connection is critical
  });
}

/**
 * Returns the MongoDB Atlas "urekhamongo" Database instance.
 */
export async function getMongoDb() {
  const mongoClient = await clientPromise;
  return mongoClient.db("urekhamongo");
}

export default clientPromise;
