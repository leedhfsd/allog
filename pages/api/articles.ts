import { NextApiRequest, NextApiResponse } from "next";
import type { Article } from "../../interfaces";
import clientPromise from "../../lib/db/db";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Article[]>,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  const data = await articleCollection.find().toArray().then();
  res.status(200).json(data);
}
