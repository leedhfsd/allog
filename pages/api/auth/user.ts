import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "../../../interfaces";
import clientPromise from "../../../lib/db/db";
import { createHashPassword } from "../../../lib/validation";
import { authOptions } from "./[...nextauth]";

async function postUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersColleciton = database.collection("users");
  const formData = req.body as User;
  const { salt, hashedPassword } = createHashPassword(formData.password);
  if (!formData.emailVerified) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const user = {
    name: formData.name,
    email: formData.email,
    image: formData.image,
    hashedPassword,
    salt,
  };
  try {
    await usersColleciton.insertOne(user);
    return res.send("User registration completed");
  } catch (err) {
    return res.status(500).send({ error: "failed to reigister user" });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const database = client.db();
  const usersColleciton = database.collection("users");
  const formData = req.body as User;
  const userEmail = formData.email;
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  // get user api 작성해서 불러오기
  try {
    await usersColleciton.deleteOne({
      userEmail,
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
  switch (req.method) {
    case "POST":
      await postUser(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
    default:
      return res.status(405).send({ error: "Not allowed request method" });
  }
  return null;
}
