import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(405).end();
  console.log("hi from bff cart clear 1");

  try {
    const authHeader = req.headers.authorization || "";

    const response = await axios.delete(
      "http://cart-service:8081/api/cart/user/clear",
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch {
    res.status(500).json({ message: "Failed to clear cart" });
  }
}
