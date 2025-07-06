'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Star,
  Calendar,
  Award,
  BarChart3,
  Play,
  History,
  Bookmark
} from 'lucide-react';

export default function StudentDashboard({ user }) {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0,
    currentStreak: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await fetch('/api/users/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent quiz results
      const resultsResponse = await fetch('/api/quiz-results/recent');
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        setRecentQuizzes(resultsData.results);
      }

      // Fetch achievements
      const achievementsResponse = await fetch('/api/users/achievements');
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements);
      }

      // Fetch recommended quizzes
      const recommendedResponse = await fetch('/api/quizzes/recommended');
      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json();
        setRecommendedQuizzes(recommendedData.quizzes);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.profile?.firstName || user.username}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey with our interactive quizzes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.totalTime / 60)}h</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link 
                href="/quiz-results" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {recentQuizzes.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{quiz.quizTitle}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{quiz.percentage}%</p>
                      <p className="text-sm text-gray-600">
                        {quiz.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
                <Link 
                  href="/categories" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start your first quiz
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement._id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No achievements yet</p>
              <p className="text-sm text-gray-500">Complete quizzes to earn badges</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Quizzes */}
      <div className="mt-8">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <Link 
              href="/categories" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Browse All
            </Link>
          </div>
          
          {recommendedQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedQuizzes.slice(0, 6).map((quiz) => (
                <div key={quiz._id} className="bg-white/50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quiz.difficulty}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{quiz.rating || 0}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.timeLimit} min</span>
                    </div>
                    <Link 
                      href={`/quiz/${quiz._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recommendations available</p>
              <Link 
                href="/categories" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Explore categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 