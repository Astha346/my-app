import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let cached: MongoClient | null = null;

export async function connectDB() {
  if (!cached) {
    cached = await client.connect();
  }
  return cached.db(process.env.DB_NAME);
}