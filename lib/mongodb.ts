import { MongoClient, Db, Collection } from 'mongodb';
import { ExperienceData } from '@/types/experience';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'lover_db';

// Serverless-safe MongoDB options
const MONGO_OPTIONS = {
  maxPoolSize: 1,           // Serverless: minimize open connections
  minPoolSize: 0,           // Allow pool to shrink to 0 when idle
  maxIdleTimeMS: 10_000,    // Close idle connections after 10s
  connectTimeoutMS: 5_000,  // Don't hang on cold start if DB is unreachable
  socketTimeoutMS: 30_000,  // 30s socket timeout
  serverSelectionTimeoutMS: 5_000, // Fail fast if server can't be found
};

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().length > 0);
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(uri, MONGO_OPTIONS);
  return client.connect();
}

// Use global caching in BOTH dev and production.
// Vercel reuses the module-level scope within the same Lambda instance,
// so this avoids creating a new connection on every warm invocation.
// In dev, it survives HMR reloads.
if (isMongoConfigured()) {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured()) return null;

  // Re-check global in case it was cleared or first access
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }

  try {
    const connectedClient = await global._mongoClientPromise;
    return connectedClient.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Reset so next invocation retries fresh
    global._mongoClientPromise = undefined;
    return null;
  }
}

let indexesInitialized = false;

export async function getExperiencesCollection(): Promise<Collection<ExperienceData & { expireAt?: Date }> | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const collection = db.collection<ExperienceData & { expireAt?: Date }>('experiences');

  // indexesInitialized resets on cold start, but createIndex is idempotent so it's safe
  if (!indexesInitialized) {
    try {
      await Promise.all([
        collection.createIndex(
          { expireAt: 1 },
          { expireAfterSeconds: 0, name: 'ttl_30_days_expireAt' }
        ),
        collection.createIndex(
          { slug: 1 },
          { unique: true, name: 'unique_slug_index' }
        ),
      ]);
      indexesInitialized = true;
    } catch {
      // Index already exists — safe to ignore
      indexesInitialized = true;
    }
  }

  return collection;
}
