import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") return res.status(405).end();
    const authHeader = req.headers.authorization || "";
    const response = await axios.get(
      "http://order-service:4000/api/orders/seller",
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch {
    res.status(500).json({ message: "Fetching seller orders failed" });
  }
}
