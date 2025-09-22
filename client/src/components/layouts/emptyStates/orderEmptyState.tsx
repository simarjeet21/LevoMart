import Link from "next/link";

export default function OrderEmptyState() {
  return (
    <div className="text-center py-24 text-olive/70">
      <p className="text-xl font-semibold">No Orders Found</p>
      <p className="text-sm mt-2 mb-6">Start adding some amazing products!</p>
      <Link
        href="/product"
        className="inline-block bg-olive text-beige px-6 py-3 rounded-full text-sm font-medium hover:bg-olive/90 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
}
