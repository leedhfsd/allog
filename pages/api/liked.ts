import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../lib/db/db";
import { authOptions } from "./auth/[...nextauth]";

async function postLikedArticle(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  id: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  const likedCollection = database.collection("likedDB");
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (name !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await articleCollection.updateOne(
      { _id: Number(id) },
      { $addToSet: { liked: name } },
    );
    await likedCollection.updateOne(
      { name },
      {
        $addToSet: { posts: id },
      },
      {
        upsert: true,
      },
    );
    return res.status(200).send({ ok: "Post Completed" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to Post liked" });
  }
}

async function postLikedUser(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  user: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const likedCollection = database.collection("likedDB");
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (name !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await likedCollection.updateOne(
      { name },
      {
        $addToSet: { users: user },
      },
      {
        upsert: true,
      },
    );
    return res.status(200).send({ ok: "Post Completed" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to Post liked" });
  }
}

async function deleteLikedArticle(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  id: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const articleCollection = database.collection("articleDB");
  const likedCollection = database.collection("likedDB");
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (name !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await articleCollection.updateOne(
      { _id: Number(id) },
      { $pull: { liked: name } },
    );
    await likedCollection.updateOne(
      { name },
      {
        $pull: { posts: id },
      },
      {
        upsert: true,
      },
    );
    return res.status(200).send({ ok: "Delete Completed" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to delete liked" });
  }
}

async function deleteLikedUser(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  user: string,
) {
  const client = await clientPromise;
  const database = client.db();
  const likedCollection = database.collection("likedDB");
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (name !== session.user?.email?.split("@")[0]) {
    return res.status(403).send({ error: "Forbidden" });
  }
  try {
    await likedCollection.updateOne(
      { name },
      {
        $pull: { users: user },
      },
      {
        upsert: true,
      },
    );
    return res.status(200).send({ ok: "Delete Completed" });
  } catch (err) {
    return res.status(500).send({ error: "Failed to delete liked" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, id, status, user } = req.query;
  switch (req.method) {
    case "POST":
      if (
        status === "posts" &&
        typeof name === "string" &&
        typeof id === "string"
      ) {
        await postLikedArticle(req, res, name, id);
        break;
      }
      if (
        status === "users" &&
        typeof name === "string" &&
        typeof user === "string"
      ) {
        await postLikedUser(req, res, name, user);
        break;
      }
      break;
    case "DELETE":
      if (
        status === "posts" &&
        typeof name === "string" &&
        typeof id === "string"
      ) {
        await deleteLikedArticle(req, res, name, id);
        break;
      }
      if (
        status === "users" &&
        typeof name === "string" &&
        typeof user === "string"
      ) {
        await deleteLikedUser(req, res, name, user);
        break;
      }
      break;

    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
