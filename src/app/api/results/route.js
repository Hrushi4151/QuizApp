import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { QuizResult } from '@/lib/models';
import { quizResultSchema } from '@/lib/schemas';

// GET: List all quiz results (with optional filters)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get('userId');
    const quizId = searchParams.get('quizId');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    
    let query = {};
    if (userId) query.userId = userId;
    if (quizId) query.quizId = quizId;
    
    const results = await QuizResult.find(query)
      .populate('userId', 'username email')
      .populate('quizId', 'title category')
      .sort({ completedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await QuizResult.countDocuments(query);
    
    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

// POST: Submit a quiz result
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const parsed = quizResultSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    
    const result = await QuizResult.create(parsed.data);
    
    const populatedResult = await QuizResult.findById(result._id)
      .populate('userId', 'username email')
      .populate('quizId', 'title category')
      .lean();
    
    return NextResponse.json(populatedResult, { status: 201 });
  } catch (error) {
    console.error('Error submitting result:', error);
    return NextResponse.json({ error: 'Failed to submit result' }, { status: 500 });
  }
} 