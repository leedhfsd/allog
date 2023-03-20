import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Article } from "../../interfaces";
import clientPromise from "../../lib/db/db";

type PatchArticle = {
  _id: number;
  title: string;
  content: string;
  hashtag: string[];
  slug: string[];
  sanitizedHtml: string;
  disclosureStatus: boolean;
};

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
  return null;
};

async function postData(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const articleCollection = db.collection("articleDB");
  const formData = req.body as Article;
  const article = {
    _id: (await getNextSequence("articleId")) as ObjectId,
    title: formData.title,
    content: formData.content,
    hashtag: formData.hashtag,
    createdAt: formData.createdAt,
    liked: [],
    writer: formData.writer,
    profile: formData.profile,
    slug: formData.slug,
    thumbnailImage: formData.thumbnailImage,
    sanitizedHtml: formData.sanitizedHtml,
    disclosureStatus: formData.disclosureStatus,
  };
  try {
    await articleCollection.insertOne(article);
    return res.status(201).send({ ok: "Post Completed" });
  } catch (err) {
    return res.status(500).send({ error: "failed to post data" });
  }
}

async function patchData(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const articleCollection = db.collection("articleDB");
  const formData = req.body as PatchArticle;
  const update = { $set: formData };
  const query = { _id: formData._id };
  try {
    await articleCollection.updateOne(query, update);
    return res.status(200).send({ ok: "Patch Compledted" });
  } catch (err) {
    return res.status(500).send({ error: "failed to patch data" });
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await postData(req, res);
      break;
    case "PATCH":
      await patchData(req, res);
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
