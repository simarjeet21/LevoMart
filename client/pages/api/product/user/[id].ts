import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  // console.log("hi from bff handeler product specific id ");
  // console.log(id);

  try {
    const response = await axios.get(
      `http://product-service:4000/api/products/${id}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
    console.error("Failed to fetch product:", err);
  }
}
