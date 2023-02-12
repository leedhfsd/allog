import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Article } from "../../interfaces";
import clientPromise from "../../lib/db/db";

const getNextSequence = async (name: string) => {
  const client = await clientPromise;
  const db = client.db();
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true },
    );
  if (result.value) {
    return result.value.seq as unknown as ObjectId;
  }
  return undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db();
  const articleCollection = db.collection("articleDB");
  if (req.method === "POST") {
    const formData = req.body as Article;
    const article = {
      _id: (await getNextSequence("articleId")) as ObjectId,
      title: formData.title,
      content: formData.content,
      hashtag: formData.hashtag,
      createdAt: formData.createdAt,
      liked: 0,
      writer: formData.writer.split("@")[0],
      profile: formData.profile,
      slug: formData.slug,
    };
    try {
      await articleCollection.insertOne(article);
      res.status(201).send("Post Completed");
    } catch (err) {
      res.status(500).send({ error: "failed to fetch data" });
    }
  }
}
