import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") return res.status(405).end();
    const { id } = req.query;
    const userId = id;
    //const userId = req.body.sellerId;
    console.log(userId);
    const authHeader = req.headers.authorization || "";
    const response = await axios.get(
      `http://product-service:4000/api/products/seller/${userId}`,
      {
        headers: { Authorization: authHeader },
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seller products" });
    console.error("Failed to fetch seller products:", err);
  }
}
