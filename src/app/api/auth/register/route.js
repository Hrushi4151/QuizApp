import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { User } from '@/lib/models';
import { setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['student', 'teacher']).default('student')
});

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
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
      profile: {
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || ''
      },
      role: validatedData.role
    });
    
    await user.save();
    
    // Set authentication cookie
    await setAuthCookie(user);
    
    // Return user data (without password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: user.stats,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      message: 'User registered successfully',
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
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