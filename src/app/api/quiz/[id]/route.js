import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { Quiz } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await dbConnect();
    
    // Get quiz by ID using Mongoose
    const quiz = await Quiz.findById(id).lean();
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
} 