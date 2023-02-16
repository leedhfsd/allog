import type { WithId, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const database = client.db();
  const { slug } = req.query;
  const articleCollection = database.collection("articleDB");
  let data: WithId<Document>[] = [];
  if (slug && slug.length === 1) {
    try {
      const writer = decodeURIComponent(slug[0]);
      const fetchData = await articleCollection
        .find({ writer })
        .sort({ _id: -1 })
        .toArray();
      data = fetchData;
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (slug && slug.length >= 2) {
    if (req.method === "GET") {
      try {
        const writer = decodeURIComponent(slug[0]);
        const articleId = parseInt(slug[1], 10);
        const fetchData = await articleCollection
          .find({ writer, _id: articleId })
          .sort({ _id: -1 })
          .toArray();
        data = fetchData;
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
      }
    } else if (req.method === "DELETE") {
      try {
        const writer = decodeURIComponent(slug[0]);
        const articleId = parseInt(slug[1], 10);
        await articleCollection.deleteOne({
          _id: articleId,
          writer,
        });
        res.status(200).send("Delete Completed");
      } catch (err) {
        res.status(500).json({ error: "Failed to Delete data" });
      }
    }
  }

  if (data.length > 0) {
    res.status(200).send(data);
  } else {
    res.status(404).send("404 Not Found");
  }
}
