import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const authHeader = req.headers.authorization || "";

  try {
    if (req.method === "GET") {
      const response = await axios.get(
        `http://order-service:4000/api/orders/user/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      return res.status(response.status).json(response.data);
    }

    if (req.method === "DELETE") {
      const response = await axios.delete(
        `http://order-service:4000/api/orders/user/${id}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      return res.status(response.status).json(response.data);
    }

    return res.status(405).end();
  } catch {
    res.status(500).json({ message: "Error handling order by ID" });
  }
}
