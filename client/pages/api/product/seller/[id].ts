import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const authHeader = req.headers.authorization || "";

  try {
    if (req.method == "DELETE") {
      const response = await axios.delete(
        `http://product-service:4000/api/products/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      res.status(200).json(response.data);
    } else if (req.method == "PUT") {
      const response = await axios.put(
        `http://product-service:4000/api/products/${id}`,
        req.body,
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json(response.data);
    } else if (req.method == "GET") {
      if (!id) return res.status(400).json({ message: "Invalid product ID" });
      const response = await axios.get(
        `http://product-service:4000/api/products/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      res.status(200).json(response.data);
    } else {
      return res.status(405).end();
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
    console.error("Failed to delete product:", err);
  }
}
