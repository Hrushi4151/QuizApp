import { z } from 'zod';

// Category Schema
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'Category name must be at least 2 characters').max(50, 'Category name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(200, 'Description must be less than 200 characters'),
  icon: z.string().min(1, 'Icon is required'),
  quizCount: z.number().int().min(0, 'Quiz count must be 0 or greater').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Question Schema
export const questionSchema = z.object({
  id: z.number().int().positive('Question ID must be a positive integer'),
  question: z.string().min(10, 'Question must be at least 10 characters').max(500, 'Question must be less than 500 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
  correctAnswer: z.number().int().min(0, 'Correct answer must be 0 or greater'),
  explanation: z.string().optional(),
  points: z.number().int().min(1, 'Points must be at least 1').default(1)
});

// Quiz Schema
export const quizSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description must be less than 300 characters'),
  questions: z.array(questionSchema).min(1, 'At least 1 question required').max(50, 'Maximum 50 questions allowed'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  timeLimit: z.number().int().min(1, 'Time limit must be at least 1 minute').max(180, 'Time limit cannot exceed 3 hours').optional(),
  passingScore: z.number().int().min(1, 'Passing score must be at least 1').max(100, 'Passing score cannot exceed 100').default(70),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// User Schema
export const userSchema = z.object({
  _id: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true),
    language: z.string().default('en')
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Quiz Result Schema
export const quizResultSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().int().min(0, 'Score must be 0 or greater'),
  totalQuestions: z.number().int().min(1, 'Total questions must be at least 1'),
  correctAnswers: z.number().int().min(0, 'Correct answers must be 0 or greater'),
  timeSpent: z.number().int().min(0, 'Time spent must be 0 or greater'),
  completedAt: z.date(),
  answers: z.array(z.object({
    questionId: z.number(),
    selectedAnswer: z.number(),
    isCorrect: z.boolean(),
    timeSpent: z.number()
  })).optional()
});

// Quiz Session Schema
export const quizSessionSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  quizId: z.string(),
  startedAt: z.date(),
  expiresAt: z.date(),
  currentQuestion: z.number().int().min(0).default(0),
  answers: z.array(z.object({
    questionId: z.number(),
    selectedAnswer: z.number().optional(),
    timeSpent: z.number().default(0)
  })).default([]),
  isCompleted: z.boolean().default(false)
});

// Comment Schema
export const commentSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  quizId: z.string(),
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be less than 500 characters'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Tag Schema
export const tagSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'Tag name must be at least 2 characters').max(30, 'Tag name must be less than 30 characters'),
  description: z.string().max(100, 'Description must be less than 100 characters').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional(),
  usageCount: z.number().int().min(0).default(0)
});

// Search Query Schema
export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty').max(100, 'Search query too long'),
  category: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['relevance', 'title', 'createdAt', 'popularity']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  total: z.number().int().min(0).optional(),
  totalPages: z.number().int().min(0).optional()
});

// API Response Schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  pagination: paginationSchema.optional()
});

// Form Validation Schemas
export const createQuizFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description must be less than 300 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  timeLimit: z.number().int().min(1).max(180).optional(),
  passingScore: z.number().int().min(1).max(100).default(70),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional()
});

export const createQuestionFormSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters').max(500, 'Question must be less than 500 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
  correctAnswer: z.number().int().min(0, 'Correct answer must be 0 or greater'),
  explanation: z.string().optional(),
  points: z.number().int().min(1).default(1)
});

export const userProfileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true),
    language: z.string().default('en')
  }).optional()
});

// Export all schemas
export {
  categorySchema,
  questionSchema,
  quizSchema,
  userSchema,
  quizResultSchema,
  quizSessionSchema,
  commentSchema,
  tagSchema,
  searchQuerySchema,
  paginationSchema,
  apiResponseSchema,
  createQuizFormSchema,
  createQuestionFormSchema,
  userProfileFormSchema
}; 