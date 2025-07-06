import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { User } from '@/lib/models';
import { setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1)
});

// POST: Login user
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Update last login and login count
    user.lastLogin = new Date();
    user.loginCount += 1;
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
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      message: 'Login successful',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
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