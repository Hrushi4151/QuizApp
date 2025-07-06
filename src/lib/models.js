import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model, models } = mongoose;

// User Schema with enhanced features
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    dateOfBirth: Date,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      quizReminders: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  stats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    badges: [String],
    achievements: [String]
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Category Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: { type: Boolean, default: true },
  quizCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Question Schema
const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  options: [{
    type: String,
    required: true,
    minlength: 1
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: String,
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  imageUrl: String,
  timeLimit: Number, // seconds per question
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Quiz Schema
const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 300
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    min: 1,
    max: 180 // 3 hours in minutes
  },
  passingScore: {
    type: Number,
    min: 1,
    max: 100,
    default: 70
  },
  isPublic: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  tags: [String],
  instructions: String,
  attemptsAllowed: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Quiz Result Schema
const quizResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0 // in seconds
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number,
    points: Number
  }],
  passed: {
    type: Boolean,
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  completedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Quiz Session Schema
const quizSessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: Number,
    timeSpent: { type: Number, default: 0 }
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  timeRemaining: Number, // in seconds
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Comment Schema
const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isPublic: { type: Boolean, default: true },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tag Schema
const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  description: {
    type: String,
    maxlength: 100
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['quiz_reminder', 'achievement', 'system', 'quiz_result'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    quizId: Schema.Types.ObjectId,
    resultId: Schema.Types.ObjectId,
    achievement: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now }
});

// Achievement Schema
const achievementSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    quizzesCompleted: Number,
    perfectScores: Number,
    totalTime: Number, // in minutes
    streakDays: Number
  },
  points: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now }
});

// User Achievement Schema
const userAchievementSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
});

// Export models
export const User = models.User || model('User', userSchema);
export const Category = models.Category || model('Category', categorySchema);
export const Question = models.Question || model('Question', questionSchema);
export const Quiz = models.Quiz || model('Quiz', quizSchema);
export const QuizResult = models.QuizResult || model('QuizResult', quizResultSchema);
export const QuizSession = models.QuizSession || model('QuizSession', quizSessionSchema);
export const Comment = models.Comment || model('Comment', commentSchema);
export const Tag = models.Tag || model('Tag', tagSchema);
export const Notification = models.Notification || model('Notification', notificationSchema);
export const Achievement = models.Achievement || model('Achievement', achievementSchema);
export const UserAchievement = models.UserAchievement || model('UserAchievement', userAchievementSchema); 