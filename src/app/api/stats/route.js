import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { Quiz, User, Category } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    
    // Get counts from database
    const [totalQuizzes, totalUsers, totalCategories] = await Promise.all([
      Quiz.countDocuments(),
      User.countDocuments(),
      Category.countDocuments()
    ]);

    // Calculate total questions
    const quizzes = await Quiz.find({}, 'questions').lean();
    const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);

    return NextResponse.json({
      totalQuizzes,
      totalQuestions,
      totalUsers,
      totalCategories
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
} 