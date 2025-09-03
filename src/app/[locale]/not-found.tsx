export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600">The page you are looking for does not exist.</p>
        <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}