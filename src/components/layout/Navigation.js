import Link from 'next/link';

export default function Navigation({ user }) {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg hover:underline">
          QuizApp
        </Link>
        <Link href="/categories" className="hover:underline">
          Categories
        </Link>
        <Link href="/quizzes" className="hover:underline">
          Quizzes
        </Link>
        {/* Add more links as needed */}
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.username}</span>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">
              Logout
            </button>
          </form>
        </div>
      )}
    </nav>
  );
} 