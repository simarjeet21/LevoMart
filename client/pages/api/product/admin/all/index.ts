import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const authHeader = req.headers.authorization || "";
    const response = await axios.get(
      "http://product-service:4000/api/products/admin",
      {
        headers: { Authorization: authHeader },
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all products" });
    console.error("Failed to fetch all products:", err);
  }
}
