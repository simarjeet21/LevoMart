import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") return res.status(405).end();
  console.log("hi from bff cart update 1");

  try {
    const authHeader = req.headers.authorization || "";

    const response = await axios.put(
      "http://cart-service:8081/api/cart/user/update-quantity",
      req.body,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch {
    res.status(500).json({ message: "Cart update failed" });
  }
}
