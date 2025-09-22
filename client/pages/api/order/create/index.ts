import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("hi from bff order create");

  try {
    const authHeader = req.headers.authorization || "";
    console.log("authHeader", authHeader);
    console.log("req.body", req.body);
    const response = await axios.post(
      "http://order-service:4000/api/orders/user",
      req.body,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
    console.error("Order creation failed:", err);
  }
}
