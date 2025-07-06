import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user from token
export async function getUserFromToken(token) {
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  // Here you would typically fetch the user from database
  // For now, we'll return the decoded payload
  return decoded;
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;
  
  return getUserFromToken(token);
}

// Require authentication middleware
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return user;
}

// Require specific role middleware
export async function requireRole(requiredRole) {
  const user = await requireAuth();
  
  if (user.role !== requiredRole && user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  return user;
}

// Set authentication cookie
export async function setAuthCookie(user) {
  const token = generateToken({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
  
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
}

// Clear authentication cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Check if user has specific role
export async function hasRole(role) {
  const user = await getCurrentUser();
  return user && (user.role === role || user.role === 'admin');
}

// Get user permissions
export function getUserPermissions(user) {
  const permissions = {
    canCreateQuiz: ['teacher', 'admin'].includes(user?.role),
    canEditQuiz: ['teacher', 'admin'].includes(user?.role),
    canDeleteQuiz: ['admin'].includes(user?.role),
    canManageUsers: ['admin'].includes(user?.role),
    canViewAnalytics: ['teacher', 'admin'].includes(user?.role),
    canCreateCategories: ['teacher', 'admin'].includes(user?.role),
    canManageContent: ['teacher', 'admin'].includes(user?.role)
  };
  
  return permissions;
} 