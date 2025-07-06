import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { User } from '@/lib/models';
import { requireAuth, requireRole } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  username: z.string().min(3).max(30).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(200).optional(),
  phone: z.string().optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  isActive: z.boolean().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      quizReminders: z.boolean().optional()
    }).optional(),
    language: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
});

// GET: Get user by ID
export async function GET(request, { params }) {
  try {
    const currentUser = await requireAuth();
    await dbConnect();
    
    const { id } = await params;
    
    // Users can only view their own profile unless they're admin
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Get user error:', error);
    
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

// PUT: Update user
export async function PUT(request, { params }) {
  try {
    const currentUser = await requireAuth();
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);
    
    // Users can only update their own profile unless they're admin
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Only admins can change roles
    if (validatedData.role && currentUser.role !== 'admin') {
      delete validatedData.role;
    }
    
    // Only admins can deactivate accounts
    if (validatedData.isActive === false && currentUser.role !== 'admin') {
      delete validatedData.isActive;
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user fields
    Object.keys(validatedData).forEach(key => {
      if (key === 'profile') {
        user.profile = { ...user.profile, ...validatedData.profile };
      } else if (key === 'preferences') {
        user.preferences = { ...user.preferences, ...validatedData.preferences };
      } else {
        user[key] = validatedData[key];
      }
    });
    
    user.updatedAt = new Date();
    await user.save();
    
    // Return updated user (without password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences,
      isActive: user.isActive,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    
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

// DELETE: Delete user (admin only)
export async function DELETE(request, { params }) {
  try {
    const admin = await requireRole('admin');
    await dbConnect();
    
    const { id } = await params;
    
    // Prevent admin from deleting themselves
    if (admin.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    
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