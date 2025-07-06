import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { User } from '@/lib/models';
import { requireRole } from '@/lib/auth';
import { z } from 'zod';

const createUserSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['student', 'teacher', 'admin']).default('student'),
  isActive: z.boolean().default(true)
});

// GET: Get all users (admin only)
export async function GET(request) {
  try {
    const user = await requireRole('admin');
    
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    
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

// POST: Create new user (admin only)
export async function POST(request) {
  try {
    const admin = await requireRole('admin');
    
    await dbConnect();
    
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role,
      isActive: validatedData.isActive,
      profile: {
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || ''
      }
    });
    
    await user.save();
    
    // Return user data (without password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 