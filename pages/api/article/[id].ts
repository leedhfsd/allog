import { NextApiRequest, NextApiResponse } from "next";
import type { Article } from "../../../interfaces";

export default function articleHandler(
  req: NextApiRequest,
  res: NextApiResponse<Article>,
);
