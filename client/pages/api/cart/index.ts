import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  console.log("hi from bff handeler cart");

  try {
    const authHeader = req.headers.authorization || "";

    const response = await axios.get(
      "http://cart-service:8081/api/cart/user/getCart",
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
    console.error("Error fetching cart:", err);
  }
}
