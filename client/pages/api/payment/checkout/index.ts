import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

type ErrorResponse = {
  message: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const authHeader = req.headers.authorization || "";

    const response = await axios.post(
      "http://payment-service:8081/api/payment/create-checkout-session  ",
      req.body,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;

    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Checkout failed";

    console.error("Checkout error:", message);
    res.status(status).json({ message });
  }
}
