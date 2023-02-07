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
    const formData = req.body as Article;
    const article: Article = {
      title: formData.title,
      content: formData.content,
      hashtag: formData.hashtag,
      createdAt: formData.createdAt,
      liked: 0,
      writer: formData.writer,
      profile: formData.profile,
    };
    try {
      await articleCollection.insertOne(article);
      res.status(200).send("Post Completed");
    } catch (err) {
      res.status(500).send({ error: "failed to fetch data" });
    }
  }
}
