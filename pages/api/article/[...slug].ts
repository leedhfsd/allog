import type { WithId, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/db/db";
import { authOptions } from "../auth/[...nextauth]";

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
      if (data.length > 0) {
        return res.status(200).send(data);
      }
      return res.status(404).send("404 Not Found");
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
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
        if (data.length > 0) {
          return res.status(200).send(data);
        }
        return res.status(404).send("404 Not Found");
      } catch (err) {
        return res.status(500).json({ error: "Failed to fetch data" });
      }
    } else if (req.method === "DELETE") {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const writer = decodeURIComponent(slug[0]);
      const articleId = parseInt(slug[1], 10);
      if (writer !== slug[0]) {
        return res.status(403).json({ error: "Forbidden" });
      }
      try {
        await articleCollection.deleteOne({
          _id: articleId,
          writer,
        });
        return res.status(200).send("Delete Completed");
      } catch (err) {
        return res.status(500).json({ error: "Failed to Delete data" });
      }
    }
  }
  return res.status(500).json({ error: "Error" });
}
