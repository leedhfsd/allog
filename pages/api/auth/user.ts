import { WithId, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "../../../interfaces";
import clientPromise from "../../../lib/db/db";
import { createHashPassword } from "../../../lib/validation";
import { authOptions } from "./[...nextauth]";

async function postUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const formData = req.body as User;
  const password = formData.password as string;
  const { salt, hashedPassword } = createHashPassword(password);
  if (!formData.emailVerified) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const user = {
    name: formData.name,
    email: formData.email,
    image: formData.image,
    nickname: formData.nickname,
    userinfo: formData.userinfo,
    hashedPassword,
    salt,
  };
  try {
    await usersCollection.insertOne(user);
    return res.send({ ok: "User registration completed" });
  } catch (err) {
    return res.status(500).send({ error: "failed to reigister user" });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const { name, email } = req.query;
  try {
    const projection = {
      name: 1,
      email: 1,
      image: 1,
      nickname: 1,
      userinfo: 1,
    };
    const fetchData = await usersCollection.findOne(
      {
        $or: [{ name }, { email }],
      },
      { projection },
    );
    if (fetchData) {
      const response = res.json(fetchData);
      return res.send(response);
    }
    return res.status(404).send({ error: "404 Not Found" });
  } catch (e) {
    return res.send({ error: "User is not registered" });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const { email } = req.query;

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (session && session.user?.email === email) {
    try {
      await usersCollection.deleteOne({ email });
      return res.status(200).send({ ok: "User data Deleted" });
    } catch (e) {
      return res.status(500).send({ error: "failed to delete user data" });
    }
  }
  return res.status(500).send({ error: "Not allowed request" });
}

async function patchUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const { email, nickname, userinfo } = req.query;
  const update = { $set: { nickname, userinfo } };
  const query = { email };
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  try {
    await usersCollection.updateOne(query, update);
    return res.status(200).send({ ok: "Patch Compledted" });
  } catch (err) {
    return res.status(500).send({ error: "failed to patch data" });
  }
}

async function patchUserImage(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const { email, image } = req.query;
  const update = { $set: { image } };
  const query = { email };
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  try {
    await usersCollection.updateOne(query, update);
    return res.status(200).send({ ok: "Patch Compledted" });
  } catch (err) {
    return res.status(500).send({ error: "failed to patch data" });
  }
}

async function getUserByArr(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  let { name } = req.query;
  let arr: string[] = [];
  if (typeof name === "string") {
    name = [name];
  }
  if (typeof name !== "undefined") {
    arr = name;
  }
  let data: WithId<Document>[] = [];
  try {
    const fetchData = await usersCollection
      .find({
        name: { $in: arr },
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
  const { status, image } = req.query;
  switch (req.method) {
    case "GET":
      if (typeof status === "string" && status === "arr") {
        await getUserByArr(req, res);
        break;
      }
      await getUser(req, res);
      break;
    case "POST":
      await postUser(req, res);
      break;
    case "PATCH":
      if (typeof image === "string") {
        await patchUserImage(req, res);
        break;
      }
      await patchUser(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
