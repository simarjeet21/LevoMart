// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   if (!res.ok) {
//     const errorBody = await res.text();
//     throw new Error(`API error (${res.status}): ${errorBody}`);
//   }

//   return res.json();
// }
