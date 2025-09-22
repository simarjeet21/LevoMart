export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-24 text-olive/70">
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-sm mt-2 mb-6">{description}</p>
    </div>
  );
}
