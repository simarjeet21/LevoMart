import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get(
      "http://auth-service:8081/api/auth/current-user",
      { headers: { Authorization: authHeader } }
    );

    const data = response.data;
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Current-user BFF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
