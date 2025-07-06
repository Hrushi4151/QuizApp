import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { Quiz } from '@/lib/models';
import { quizSchema } from '@/lib/schemas';

// GET: Get a single quiz by ID
export async function GET(request, { params }) {
  try {
    const { quizId } = params;
    await dbConnect();
    
    const quiz = await Quiz.findById(quizId).lean();
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}

// PUT: Update a quiz
export async function PUT(request, { params }) {
  try {
    const { quizId } = params;
    await dbConnect();
    
    const body = await request.json();
    const parsed = quizSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    
    const quiz = await Quiz.findByIdAndUpdate(quizId, parsed.data, { new: true });
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

// DELETE: Delete a quiz
export async function DELETE(request, { params }) {
  try {
    const { quizId } = params;
    await dbConnect();
    
    const quiz = await Quiz.findByIdAndDelete(quizId);
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
} 