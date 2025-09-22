import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") return res.status(405).end();
  const { id } = req.query;

  const authHeader = req.headers.authorization || "";

  try {
    const response = await axios.post(
      `http://product-service:4000/api/products/${id}`,
      req.body,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
    console.error("Failed to create product:", err);
  }
}
