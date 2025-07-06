import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { Category } from '@/lib/models';
import { categorySchema } from '@/lib/schemas';

// GET: List all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).lean();
    
    // If no categories in database, return empty array
    if (!categories || categories.length === 0) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const category = await Category.create(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 