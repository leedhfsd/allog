import type { WithId, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../lib/db/db";
import { authOptions } from "./auth/[...nextauth]";

async function getAritcleByWriter(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
  status: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data: WithId<Document>[] = [];

  if (status === "true") {
    try {
      const fetchData = await articleCollection
        .find({ writer })
        .sort({ _id: -1 })
        .toArray();
      data = fetchData;
      if (data.length > 0) {
        return res.status(200).send(data);
      }
      return res.status(404).send({ error: "404 Not Found" });
    } catch (err) {
      return res.status(500).send({ error: "Failed to fetch data" });
    }
  }

  try {
    const fetchData = await articleCollection
      .find({ $and: [{ writer }, { disclosureStatus: false }] })
      .sort({ _id: -1 })
      .toArray();
    data = fetchData;
    if (data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function getAritcleByWriterAndId(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
  id: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data = [];
  try {
    const fetchData = await articleCollection.findOne({
      writer,
      _id: Number(id),
    });
    data = [fetchData];
    if (data && Object.keys(data)) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function getArticleByHashtag(
  req: NextApiRequest,
  res: NextApiResponse,
  hashtag: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data = [];
  try {
    const fetchData = await articleCollection
      .find({ $and: [{ hashtag }, { disclosureStatus: false }] })
      .toArray();
    data = fetchData;

    if (data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function getArticleByAll(
  req: NextApiRequest,
  res: NextApiResponse,
  all: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let data: WithId<Document>[] = [];
  try {
    const fetchData = await articleCollection
      .find({
        $and: [
          {
            $or: [
              { hashtag: all },
              { writer: all },
              { title: { $regex: `${all}`, $options: "i" } },
            ],
          },
          { disclosureStatus: false },
        ],
      })
      .toArray();
    if (fetchData.length > 0) data = fetchData;
    if (data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function deleteArticle(
  req: NextApiRequest,
  res: NextApiResponse,
  writer: string,
  id: string | undefined,
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
  if (typeof id === "string") {
    try {
      await articleCollection.deleteOne({
        _id: Number(id),
        writer,
      });
      return res.status(200).send({ ok: "Delete Completed" });
    } catch (err) {
      return res.status(500).send({ error: "Failed to Delete data" });
    }
  }
  if (typeof id === "undefined") {
    try {
      await articleCollection.deleteMany({
        writer,
      });
      return res
        .status(200)
        .send({ ok: "All articles of the user have been deleted" });
    } catch (err) {
      return res.status(500).send({ error: "Failed to Delete data" });
    }
  }
  return res.status(500).send({ error: "Not allowed query" });
}

async function getArticleByIdArr(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  let { id } = req.query;
  let arr: number[] = [];
  if (typeof id === "string") {
    id = [id];
  }
  if (typeof id !== "undefined") {
    arr = id.map((item) => Number(item));
  }
  let data: WithId<Document>[] = [];
  try {
    const fetchData = await articleCollection
      .find({
        $and: [{ _id: { $in: arr } }, { disclosureStatus: false }],
      })
      .sort({ _id: -1 })
      .toArray();
    data = fetchData;
    if (data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { writer, id, hashtag, all, status } = req.query;
  switch (req.method) {
    case "GET":
      if (typeof status === "string" && status === "arr") {
        await getArticleByIdArr(req, res);
        break;
      }
      if (typeof hashtag === "string") {
        await getArticleByHashtag(req, res, hashtag);
        break;
      }
      if (typeof all === "string") {
        await getArticleByAll(req, res, all);
        break;
      }
      if (typeof writer === "string" && typeof id === "string") {
        await getAritcleByWriterAndId(req, res, decodeURIComponent(writer), id);
        break;
      } else if (typeof writer === "string" && typeof status === "string") {
        await getAritcleByWriter(req, res, decodeURIComponent(writer), status);
        break;
      }
      break;
    case "DELETE":
      if (
        typeof writer === "string" &&
        (typeof id === "string" || typeof id === "undefined")
      ) {
        await deleteArticle(req, res, writer, id);
      }
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
