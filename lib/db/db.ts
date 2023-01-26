import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error();
}
const uri = process.env.MONGODB_URI;
const option = {};
const client = new MongoClient(uri, option);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
