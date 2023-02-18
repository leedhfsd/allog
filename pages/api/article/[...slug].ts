import type { WithId, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/db/db";
import { authOptions } from "../auth/[...nextauth]";

async function getAritcleByWriter(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data: WithId<Document>[] = [];
  try {
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
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function getAritcleByID(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
  id: number,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data: WithId<Document>[] = [];
  try {
    const fetchData = await articleCollection
      .find({ writer, _id: id })
      .sort({ _id: -1 })
      .toArray();
    data = fetchData;
    if (data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send("404 Not Found");
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function deleteArticle(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
  id: number,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (writer !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await articleCollection.deleteOne({
      _id: id,
      writer,
    });
    return res.status(200).send("Delete Completed");
  } catch (err) {
    return res.status(500).send({ error: "Failed to Delete data" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  switch (req.method) {
    case "GET":
      if (slug && slug.length === 1) {
        const writer = decodeURIComponent(slug[0]);
        await getAritcleByWriter(req, res, writer);
      } else if (slug && slug.length >= 2) {
        const writer = decodeURIComponent(slug[0]);
        const id = parseInt(slug[1], 10);
        await getAritcleByID(req, res, writer, id);
      }
      break;
    case "DELETE":
      if (slug && slug.length >= 2) {
        const writer = decodeURIComponent(slug[0]);
        const id = parseInt(slug[1], 10);
        await deleteArticle(req, res, writer, id);
      }
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return undefined;
}
