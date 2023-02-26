import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db/db";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  const data = await articleCollection.find().sort({ _id: -1 }).toArray();
  res.status(200).send(data);
}
