import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { QuizResult, User } from '@/lib/models';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await requireAuth();
    await dbConnect();
    
    // Get user's quiz results
    const results = await QuizResult.find({ userId: user.id });
    
    // Calculate stats
    const totalQuizzes = results.length;
    const completedQuizzes = results.filter(r => r.passed).length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    
    // Calculate current streak (simplified)
    const currentStreak = 0; // This would require more complex logic
    
    return NextResponse.json({
      totalQuizzes,
      completedQuizzes,
      averageScore,
      totalTime,
      currentStreak
    });
    
  } catch (error) {
    console.error('Get user stats error:', error);
    
    if (error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 