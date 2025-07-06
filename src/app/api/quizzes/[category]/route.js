import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import { Quiz } from '@/lib/models';
import { quizSchema } from '@/lib/schemas';

// Mock quiz data by category
const quizzesByCategory = {
  history: [
    {
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
    {
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
    {
      _id: 'history-3',
      title: 'American Revolution',
      description: 'Test your knowledge of the American Revolutionary War',
      category: 'history',
      difficulty: 'hard',
      timeLimit: 20,
      rating: 4.0,
      questions: [
        {
          question: 'In which year was the Declaration of Independence signed?',
          options: ['1775', '1776', '1777', '1778'],
          correctAnswer: 1,
          explanation: 'The Declaration of Independence was signed in 1776.'
        }
      ]
    }
  ],
  science: [
    {
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
    {
      _id: 'science-2',
      title: 'Human Biology',
      description: 'Test your knowledge of human anatomy and physiology',
      category: 'science',
      difficulty: 'medium',
      timeLimit: 15,
      rating: 4.1,
      questions: [
        {
          question: 'How many bones are in the adult human body?',
          options: ['206', '212', '198', '220'],
          correctAnswer: 0,
          explanation: 'The adult human body has 206 bones.'
        }
      ]
    },
    {
      _id: 'science-3',
      title: 'Physics Fundamentals',
      description: 'Learn about motion, energy, and forces',
      category: 'science',
      difficulty: 'hard',
      timeLimit: 20,
      rating: 4.4,
      questions: [
        {
          question: 'What is the SI unit of force?',
          options: ['Joule', 'Watt', 'Newton', 'Pascal'],
          correctAnswer: 2,
          explanation: 'The Newton (N) is the SI unit of force.'
        }
      ]
    }
  ],
  math: [
    {
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
    {
      _id: 'math-2',
      title: 'Algebra Basics',
      description: 'Solve simple algebraic equations and expressions',
      category: 'math',
      difficulty: 'medium',
      timeLimit: 15,
      rating: 4.2,
      questions: [
        {
          question: 'Solve for x: 2x + 5 = 13',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4'
        }
      ]
    },
    {
      _id: 'math-3',
      title: 'Geometry',
      description: 'Learn about shapes, angles, and geometric formulas',
      category: 'math',
      difficulty: 'hard',
      timeLimit: 20,
      rating: 4.1,
      questions: [
        {
          question: 'What is the area of a circle with radius 5?',
          options: ['25π', '50π', '75π', '100π'],
          correctAnswer: 0,
          explanation: 'Area = πr² = π(5)² = 25π'
        }
      ]
    }
  ],
  programming: [
    {
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
    },
    {
      _id: 'programming-2',
      title: 'React Fundamentals',
      description: 'Test your knowledge of React components and hooks',
      category: 'programming',
      difficulty: 'medium',
      timeLimit: 15,
      rating: 4.3,
      questions: [
        {
          question: 'What hook is used for side effects in React?',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correctAnswer: 1,
          explanation: 'useEffect is used for side effects like API calls and subscriptions.'
        }
      ]
    },
    {
      _id: 'programming-3',
      title: 'Data Structures',
      description: 'Learn about arrays, objects, and other data structures',
      category: 'programming',
      difficulty: 'hard',
      timeLimit: 20,
      rating: 4.0,
      questions: [
        {
          question: 'What is the time complexity of accessing an array element?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 0,
          explanation: 'Array access is O(1) - constant time complexity.'
        }
      ]
    }
  ]
};

// GET: Get quizzes by category
export async function GET(request, { params }) {
  try {
    const { category } = await params;
    const quizzes = quizzesByCategory[category] || [];
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// POST: Create a new quiz in a category
export async function POST(request, { params }) {
  try {
    const { category } = await params;
    await dbConnect();
    
    const body = await request.json();
    const quizData = { ...body, category };
    
    const parsed = quizSchema.safeParse(quizData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    
    const quiz = await Quiz.create(parsed.data);
    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
} 