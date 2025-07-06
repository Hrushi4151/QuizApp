'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Eye,
  TrendingUp,
  Clock,
  Target,
  Star,
  MessageSquare,
  Settings
} from 'lucide-react';

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    averageCompletionRate: 0,
    totalAttempts: 0
  });
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher stats
      const statsResponse = await fetch('/api/teachers/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch teacher's quizzes
      const quizzesResponse = await fetch('/api/teachers/quizzes');
      if (quizzesResponse.ok) {
        const quizzesData = await quizzesResponse.json();
        setMyQuizzes(quizzesData.quizzes);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/teachers/activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activity);
      }

      // Fetch top performers
      const performersResponse = await fetch('/api/teachers/top-performers');
      if (performersResponse.ok) {
        const performersData = await performersResponse.json();
        setTopPerformers(performersData.students);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
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
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your quizzes and track student progress
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
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageCompletionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Quizzes */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Quizzes</h2>
              <Link 
                href="/quiz/create" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Quiz</span>
              </Link>
            </div>
            
            {myQuizzes.length > 0 ? (
              <div className="space-y-4">
                {myQuizzes.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{quiz.title}</p>
                        <p className="text-sm text-gray-600">
                          {quiz.questions?.length || 0} questions • {quiz.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/quiz/${quiz._id}/edit`}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/quiz/${quiz._id}/analytics`}
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/quiz/${quiz._id}`}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quizzes created yet</p>
                <Link 
                  href="/quiz/create" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first quiz
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link 
              href="/quiz/create"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Quiz</p>
                <p className="text-sm text-gray-600">Design a new quiz</p>
              </div>
            </Link>

            <Link 
              href="/analytics"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Track performance</p>
              </div>
            </Link>

            <Link 
              href="/students"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Students</p>
                <p className="text-sm text-gray-600">View student progress</p>
              </div>
            </Link>

            <Link 
              href="/settings"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link 
              href="/activity" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity._id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
            <Link 
              href="/students" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {topPerformers.length > 0 ? (
            <div className="space-y-4">
              {topPerformers.slice(0, 5).map((student, index) => (
                <div key={student._id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.username}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{student.averageScore}%</p>
                    <p className="text-sm text-gray-600">{student.quizzesCompleted} quizzes</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No performance data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 