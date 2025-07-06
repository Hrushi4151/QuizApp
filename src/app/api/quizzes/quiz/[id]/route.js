import { NextResponse } from 'next/server';

// Mock quiz data - in a real app, this would come from a database
const allQuizzes = {
  'history-1': {
    _id: 'history-1',
    title: 'Ancient Civilizations',
    description: 'Test your knowledge of ancient civilizations like Egypt, Greece, and Rome',
    category: 'history',
    difficulty: 'easy',
    timeLimit: 10,
    rating: 4.5,
    questions: [
      {
        question: 'Which ancient civilization built the pyramids?',
        options: ['Greece', 'Egypt', 'Rome', 'China'],
        correctAnswer: 1,
        explanation: 'The ancient Egyptians built the pyramids as tombs for their pharaohs.'
      },
      {
        question: 'Who was the first emperor of Rome?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Constantine'],
        correctAnswer: 1,
        explanation: 'Augustus was the first Roman emperor, ruling from 27 BC to 14 AD.'
      },
      {
        question: 'In which year did Columbus discover America?',
        options: ['1490', '1492', '1495', '1500'],
        correctAnswer: 1,
        explanation: 'Christopher Columbus discovered America in 1492.'
      }
    ]
  },
  'history-2': {
    _id: 'history-2',
    title: 'World Wars',
    description: 'Learn about the major events and figures of World War I and II',
    category: 'history',
    difficulty: 'medium',
    timeLimit: 15,
    rating: 4.2,
    questions: [
      {
        question: 'When did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.'
      },
      {
        question: 'Which country was NOT part of the Axis powers?',
        options: ['Germany', 'Italy', 'Japan', 'France'],
        correctAnswer: 3,
        explanation: 'France was part of the Allied powers, not the Axis.'
      }
    ]
  },
  'science-1': {
    _id: 'science-1',
    title: 'Basic Chemistry',
    description: 'Learn about atoms, molecules, and chemical reactions',
    category: 'science',
    difficulty: 'easy',
    timeLimit: 10,
    rating: 4.3,
    questions: [
      {
        question: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Fe', 'Cu'],
        correctAnswer: 1,
        explanation: 'Au is the chemical symbol for gold, from the Latin word "aurum".'
      },
      {
        question: 'What is the most abundant element in the universe?',
        options: ['Helium', 'Carbon', 'Oxygen', 'Hydrogen'],
        correctAnswer: 3,
        explanation: 'Hydrogen is the most abundant element in the universe.'
      }
    ]
  },
  'math-1': {
    _id: 'math-1',
    title: 'Basic Arithmetic',
    description: 'Practice addition, subtraction, multiplication, and division',
    category: 'math',
    difficulty: 'easy',
    timeLimit: 10,
    rating: 4.0,
    questions: [
      {
        question: 'What is 15 + 27?',
        options: ['40', '42', '43', '41'],
        correctAnswer: 1,
        explanation: '15 + 27 = 42'
      },
      {
        question: 'What is 8 × 7?',
        options: ['54', '56', '58', '60'],
        correctAnswer: 1,
        explanation: '8 × 7 = 56'
      }
    ]
  },
  'programming-1': {
    _id: 'programming-1',
    title: 'JavaScript Basics',
    description: 'Learn fundamental JavaScript concepts and syntax',
    category: 'programming',
    difficulty: 'easy',
    timeLimit: 10,
    rating: 4.5,
    questions: [
      {
        question: 'How do you declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3,
        explanation: 'JavaScript supports var, let, and const for variable declaration.'
      },
      {
        question: 'What is the result of 2 + "2" in JavaScript?',
        options: ['4', '22', 'NaN', 'Error'],
        correctAnswer: 1,
        explanation: 'JavaScript converts the number to string and concatenates: "22"'
      }
    ]
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const quiz = allQuizzes[id];
    
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