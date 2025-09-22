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
        `http://product-service:4000/api/products/admin/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      res.status(200).json(response.data);
    }

    if (req.method == "GET") {
      const response = await axios.get(
        `http://product-service:4000/api/products/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      res.status(200).json(response.data);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
    console.error("Failed to delete product:", err);
  }
}
