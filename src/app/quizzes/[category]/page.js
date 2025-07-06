import Link from "next/link";
import { ArrowLeft, Clock, Users, Trophy, Sparkles, BookOpen, Brain, Calculator, Code, Star, Play } from "lucide-react";

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const category = params.category;
  const categoryNames = {
    history: 'History',
    science: 'Science',
    math: 'Mathematics',
    programming: 'Programming'
  };
  
  return {
    title: `${categoryNames[category] || 'Quiz'} Quizzes - Micro-Quiz Platform`,
    description: `Explore ${categoryNames[category] || 'quiz'} quizzes and test your knowledge. Choose from our collection of interactive quizzes.`,
    keywords: `${category}, quiz, learning, education, ${categoryNames[category]?.toLowerCase()}`,
  };
}

// Server-side rendering
export async function generateStaticParams() {
  return [
    { category: 'history' },
    { category: 'science' },
    { category: 'math' },
    { category: 'programming' },
  ];
}

export default async function CategoryPage({ params }) {
  const { category } = params;
  
  // Fetch quizzes for this category from API route
  let quizzes = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/quizzes/${category}`, {
      cache: 'no-store' // Ensure SSR
    });
    if (response.ok) {
      quizzes = await response.json();
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  }

  const categoryNames = {
    history: 'History',
    science: 'Science',
    math: 'Mathematics',
    programming: 'Programming'
  };

  const iconMap = {
    history: BookOpen,
    science: Brain,
    math: Calculator,
    programming: Code,
  };

  const IconComponent = iconMap[category] || BookOpen;

  return (
    <div className="min-h-screen p-4 sm:p-8 gradient-bg">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="glass-effect p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="ios-icon w-12 h-12">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {categoryNames[category] || 'Quiz'} Quizzes
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test your knowledge in {categoryNames[category]?.toLowerCase() || 'this category'} with our interactive quizzes
          </p>
        </div>
      </header>

      {/* Quizzes Grid */}
      <main className="max-w-6xl mx-auto">
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="glass-effect p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{quiz.rating || 0}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {quiz.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.timeLimit || 10} min</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {quiz.questions?.length || 0} questions
                  </div>
                </div>
                
                <Link
                  href={`/quiz/${quiz._id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Quiz</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="ios-icon w-16 h-16 mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No quizzes available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for new quizzes in this category
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Back to Categories</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 