// import axios from "axios";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "PATCH") return res.status(405).end();
//   const { id, status } = req.body;

//   console.log("Updating order status", id, status);

//   if (!id || !status) {
//     return res.status(400).json({ message: "Missing 'id' or 'status'" });
//   }
//   try {
//     const authHeader = req.headers.authorization || "";
//     const { id, status } = req.body;

//     const response = await axios.patch(
//       `http://order-service:4000/api/orders/seller/${id}/status`,
//       { status },
//       {
//         headers: {
//           Authorization: authHeader,
//         },
//       }
//     );

//     res.status(response.status).json(response.data);
//   } catch {
//     res.status(500).json({ message: "Failed to update order status" });
//   }
// }
import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") return res.status(405).end();

  const { id, status } = req.body;
  const authHeader = req.headers.authorization || "";

  console.log("Updating order status", id, status);

  if (!id || !status) {
    return res.status(400).json({ message: "Missing 'id' or 'status'" });
  }

  try {
    const response = await axios.patch(
      `http://order-service:4000/api/orders/seller/${id}/status`,
      { status },
      {
        headers: {
          Authorization: authHeader,
        },
        // ✅ prevent axios from throwing on non-2xx status
        validateStatus: () => true,
      }
    );

    // ✅ Log full response for debugging
    console.log("Response from internal order service:", {
      status: response.status,
      data: response.data,
    });

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json(response.data);
    } else {
      return res.status(response.status).json({
        message: "Backend responded with error",
        details: response.data,
      });
    }
  } catch (err) {
    const error = err as AxiosError;
    console.error("Unexpected error:", error.message || error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
