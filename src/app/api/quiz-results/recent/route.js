import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { requireAuth } from '@/lib/auth';
import { QuizResult } from '@/lib/models';

export async function GET(request) {
  try {
    const user = await requireAuth();
    await dbConnect();
    
    // Get recent quiz results with quiz details
    const results = await QuizResult.find({ userId: user.id })
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .limit(10);
    
    // Format results
    const formattedResults = results.map(result => ({
      _id: result._id,
      quizTitle: result.quizId?.title || 'Unknown Quiz',
      percentage: result.percentage,
      passed: result.passed,
      completedAt: result.completedAt,
      timeSpent: result.timeSpent
    }));
    
    return NextResponse.json({
      results: formattedResults
    });
    
  } catch (error) {
    console.error('Get recent results error:', error);
    
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