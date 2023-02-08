import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const database = client.db();
  const { slug } = req.query;
  const articleCollection = database.collection("articleDB");
  let data = [];
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
  } else if (slug && slug.length === 2) {
    try {
      const writer = decodeURIComponent(slug[0]);
      const title = decodeURIComponent(slug[1]);
      const fetchData = await articleCollection
        .find({ writer })
        .sort({ _id: -1 })
        .toArray();
      data = fetchData;
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }

  if (data.length > 0) {
    res.status(200).send(data);
  } else {
    res.status(404).send("404 Not Found");
  }
  const data = await articleCollection.find().sort({ _id: -1 }).toArray();
}
