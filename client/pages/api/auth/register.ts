import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // const response = await fetch("http://auth-service:8080/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(req.body),
    // });
    console.log("hi from bff");
    console.log(req.body);
    const response = await axios.post(
      "http://auth-service:8081/api/auth/register",
      req.body
    );
    const data = await response.data;
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Register BFF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
