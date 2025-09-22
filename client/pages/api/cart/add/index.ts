// /pages/api/cart/add/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
type ErrorResponse = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("✅ cart BFF handler hit");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await axios.post(
      "http://cart-service:8081/api/cart/user/add", // or whatever internal DNS you're using
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || "", // pass along auth token if present
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    console.error(
      "❌ Error forwarding to cart service:",
      error?.response?.data || error.message
    );
    return res.status(error?.response?.status || 500).json({
      error: error?.response?.data || "Internal Server Error",
    });
  }
}
