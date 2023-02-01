import type { NextApiRequest, NextApiResponse } from "next";
import { Article } from "../../interfaces";
import clientPromise from "../../lib/db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  if (req.method === "POST") {
    const article: Article = {
      title: req.body.title,
      content: req.body.content,
      hashtag: req.body.hashtag,
      createdAt: req.body.createdAt,
      liked: 0,
      writer: req.body.writer,
      profile: req.body.profile,
    };
    try {
      await articleCollection.insertOne(article);
      res.status(200).send("Post Completed");
    } catch (err) {
      res.status(500).send({ error: "failed to fetch data" });
    }
  }
}
