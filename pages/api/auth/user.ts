import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "../../../interfaces";
import clientPromise from "../../../lib/db/db";
import {
  createHashPassword,
  validationPassword,
} from "../../../lib/validation";
import { authOptions } from "./[...nextauth]";

async function postUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const formData = req.body as User;
  const { salt, hashedPassword } = createHashPassword(formData.password);
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
    return res.send("User registration completed");
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
    const projection = { name: 1, email: 1, image: 1, nickname: 1 };
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
    return res.status(404).send("404 Not Found");
  } catch (e) {
    return res.send({ error: "User is not registered" });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersCollection = database.collection("users");
  const formData = req.query;
  const userEmail = formData.email;
  const enteredPassword = formData.password;
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const fetchUser = await usersCollection.findOne({ userEmail });
  if (fetchUser) {
    const { hashedPassword, salt } = fetchUser;
    if (validationPassword(enteredPassword, hashedPassword, salt)) {
      try {
        await usersCollection.deleteOne({ userEmail });
        return res.status(200).send("User data Deleted");
      } catch (e) {
        return res.status(500).send({ error: "failed to delete user data" });
      }
    } else {
      return res.status(404).send({ error: "404 Not Found" });
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
    return res.status(200).send("Patch Compledted");
  } catch (err) {
    return res.status(500).send({ error: "failed to patch data" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      await getUser(req, res);
      break;
    case "POST":
      await postUser(req, res);
      break;
    case "PATCH":
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