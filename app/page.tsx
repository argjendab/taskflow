export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-blue-500 font-bold">TaskFlow</h1>
          <div className="space-x-4">
          <a href="">Login</a>
          <a href="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Get Started
            </a>
          </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Organize Your Work, <br />
          <span className="text-blue-600">Flow Through Tasks</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Simple, beautiful task management. No complexity, just flow.</p>

        <div className="space-x-4">
          <a href="/dashboard" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600">Try Demo</a>
          <a href="/register" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-white">Sign Up Free</a>
        </div>
      </main>
    </div>
  );
}