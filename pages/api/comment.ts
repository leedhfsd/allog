import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Comment } from "../../interfaces";
import clientPromise from "../../lib/db/db";
import { authOptions } from "./auth/[...nextauth]";

async function getComment(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const commentCollection = database.collection("commentDB");
  const { id } = req.query;
  let data = [];
  try {
    const fetchData = await commentCollection
      .find({
        articleId: id,
      })
      .toArray();
    data = fetchData;
    if (data && data.length > 0) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to fetch data" });
  }
}

async function postComment(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const commentCollection = database.collection("commentDB");
  const session = await getServerSession(req, res, authOptions);
  const body = req.body as Comment;

  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (body.email !== session.user?.email) {
    return res.status(403).send({ error: "Forbidden" });
  }

  try {
    await commentCollection.insertOne(body);
    return res.status(201).send({ ok: "Post Completed" });
  } catch (err) {
    return res.status(500).send({ error: "failed to post data" });
  }
}

async function patchComment(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const commentCollection = database.collection("commentDB");
  const session = await getServerSession(req, res, authOptions);
  const body = req.body as Comment;
  const update = { $set: body };
  const query = { _id: body._id };

  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (body.email !== session.user?.email) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await commentCollection.updateOne(query, update);
    return res.status(200).send({ ok: "Patch Compledted" });
  } catch (err) {
    return res.status(500).send({ error: "failed to patch data" });
  }
}

async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const commentCollection = database.collection("commentDB");
  const session = await getServerSession(req, res, authOptions);
  const { id, writer } = req.query;
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (writer !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await commentCollection.deleteOne({
      _id: id,
      writer,
    });
    return res.status(200).send({ ok: "Delete Completed" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to Delete data" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      await getComment(req, res);
      break;
    case "POST":
      await postComment(req, res);
      break;
    case "PATCH":
      await patchComment(req, res);
      break;
    case "DELETE":
      await deleteComment(req, res);
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
