export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-olive px-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-6xl">🚫</div>
        <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="text-base text-olive/70">
          You do not have permission to view this page.
        </p>
        <p className="text-sm text-olive/50">
          Please log in with the correct account or return to the homepage.
        </p>
      </div>
    </div>
  );
}
