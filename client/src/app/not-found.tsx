import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-700">
      <h1 className="text-5xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-6">Sorry, this page does not exist.</p>
      <Link href="/" className="text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
}
