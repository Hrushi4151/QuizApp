import clientPromise from './mongodb';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db('quiz-platform');
}

export async function getCategories() {
  const db = await getDatabase();
  return await db.collection('categories').find({}).toArray();
}

export async function getQuizzesByCategory(category) {
  const db = await getDatabase();
  return await db.collection('quizzes').find({ category }).toArray();
}

export async function getQuizById(id) {
  const db = await getDatabase();
  return await db.collection('quizzes').findOne({ _id: id });
}

export async function initializeDatabase() {
  const db = await getDatabase();
  
  // Check if data already exists
  const categoriesCount = await db.collection('categories').countDocuments();
  const quizzesCount = await db.collection('quizzes').countDocuments();
  
  if (categoriesCount === 0) {
    await db.collection('categories').insertMany([
      {
        _id: 'history',
        name: 'History',
        description: 'Test your knowledge of historical events and figures',
        icon: '🏛️',
        quizCount: 3
      },
      {
        _id: 'science',
        name: 'Science',
        description: 'Explore scientific concepts and discoveries',
        icon: '🔬',
        quizCount: 3
      },
      {
        _id: 'math',
        name: 'Mathematics',
        description: 'Challenge yourself with mathematical problems',
        icon: '📐',
        quizCount: 3
      },
      {
        _id: 'programming',
        name: 'Programming',
        description: 'Test your coding knowledge and skills',
        icon: '💻',
        quizCount: 3
      }
    ]);
  }
  
  if (quizzesCount === 0) {
    await db.collection('quizzes').insertMany([
      // History Quizzes
      {
        _id: 'ancient-civilizations',
        title: 'Ancient Civilizations',
        category: 'history',
        description: 'Test your knowledge of ancient civilizations',
        questions: [
          {
            id: 1,
            question: 'Which ancient civilization built the pyramids?',
            options: ['Greeks', 'Romans', 'Egyptians', 'Persians'],
            correctAnswer: 2
          },
          {
            id: 2,
            question: 'The Great Wall of China was built during which dynasty?',
            options: ['Ming', 'Qin', 'Han', 'Tang'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'Which city was the capital of the Roman Empire?',
            options: ['Athens', 'Rome', 'Constantinople', 'Alexandria'],
            correctAnswer: 1
          }
        ]
      },
      {
        _id: 'world-war-ii',
        title: 'World War II',
        category: 'history',
        description: 'Key events and figures of World War II',
        questions: [
          {
            id: 1,
            question: 'In which year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            correctAnswer: 2
          },
          {
            id: 2,
            question: 'Which country was the first to declare war on Germany?',
            options: ['France', 'Britain', 'Poland', 'Soviet Union'],
            correctAnswer: 2
          },
          {
            id: 3,
            question: 'Who was the leader of Nazi Germany?',
            options: ['Mussolini', 'Hitler', 'Stalin', 'Churchill'],
            correctAnswer: 1
          }
        ]
      },
      {
        _id: 'american-revolution',
        title: 'American Revolution',
        category: 'history',
        description: 'The birth of American independence',
        questions: [
          {
            id: 1,
            question: 'In which year was the Declaration of Independence signed?',
            options: ['1775', '1776', '1777', '1778'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'Who was the first President of the United States?',
            options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'],
            correctAnswer: 2
          },
          {
            id: 3,
            question: 'Which battle marked the end of the American Revolution?',
            options: ['Battle of Yorktown', 'Battle of Saratoga', 'Battle of Bunker Hill', 'Battle of Trenton'],
            correctAnswer: 0
          }
        ]
      },
      
      // Science Quizzes
      {
        _id: 'chemistry-basics',
        title: 'Chemistry Basics',
        category: 'science',
        description: 'Fundamental concepts in chemistry',
        questions: [
          {
            id: 1,
            question: 'What is the chemical symbol for gold?',
            options: ['Ag', 'Au', 'Fe', 'Cu'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'What is the most abundant element in the universe?',
            options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'What is the pH of a neutral solution?',
            options: ['0', '7', '14', '10'],
            correctAnswer: 1
          }
        ]
      },
      {
        _id: 'physics-fundamentals',
        title: 'Physics Fundamentals',
        category: 'science',
        description: 'Basic principles of physics',
        questions: [
          {
            id: 1,
            question: 'What is the SI unit of force?',
            options: ['Joule', 'Watt', 'Newton', 'Pascal'],
            correctAnswer: 2
          },
          {
            id: 2,
            question: 'What is the speed of light in vacuum?',
            options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'],
            correctAnswer: 0
          },
          {
            id: 3,
            question: 'Which scientist is known for the theory of relativity?',
            options: ['Newton', 'Einstein', 'Galileo', 'Copernicus'],
            correctAnswer: 1
          }
        ]
      },
      {
        _id: 'biology-essentials',
        title: 'Biology Essentials',
        category: 'science',
        description: 'Core concepts in biology',
        questions: [
          {
            id: 1,
            question: 'What is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'What is the process by which plants make food?',
            options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'How many chromosomes do humans have?',
            options: ['23', '46', '44', '48'],
            correctAnswer: 1
          }
        ]
      },
      
      // Math Quizzes
      {
        _id: 'algebra-basics',
        title: 'Algebra Basics',
        category: 'math',
        description: 'Fundamental algebraic concepts',
        questions: [
          {
            id: 1,
            question: 'What is the value of x in 2x + 5 = 11?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'What is the slope of the line y = 3x + 2?',
            options: ['2', '3', '5', '1'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'What is the quadratic formula?',
            options: ['x = -b ± √(b² - 4ac) / 2a', 'x = b ± √(b² - 4ac) / 2a', 'x = -b ± √(b² + 4ac) / 2a', 'x = b ± √(b² + 4ac) / 2a'],
            correctAnswer: 0
          }
        ]
      },
      {
        _id: 'geometry-fundamentals',
        title: 'Geometry Fundamentals',
        category: 'math',
        description: 'Basic geometric concepts',
        questions: [
          {
            id: 1,
            question: 'What is the area of a circle with radius 5?',
            options: ['25π', '50π', '75π', '100π'],
            correctAnswer: 0
          },
          {
            id: 2,
            question: 'How many sides does a hexagon have?',
            options: ['5', '6', '7', '8'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'What is the Pythagorean theorem?',
            options: ['a² + b² = c²', 'a² - b² = c²', 'a² + b² = c', 'a + b = c'],
            correctAnswer: 0
          }
        ]
      },
      {
        _id: 'calculus-intro',
        title: 'Calculus Introduction',
        category: 'math',
        description: 'Introduction to calculus concepts',
        questions: [
          {
            id: 1,
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'What is the integral of 2x?',
            options: ['x²', 'x² + C', '2x²', '2x² + C'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'What is the limit of 1/x as x approaches infinity?',
            options: ['0', '1', 'Infinity', 'Undefined'],
            correctAnswer: 0
          }
        ]
      },
      
      // Programming Quizzes
      {
        _id: 'javascript-basics',
        title: 'JavaScript Basics',
        category: 'programming',
        description: 'Fundamental JavaScript concepts',
        questions: [
          {
            id: 1,
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'All of the above'],
            correctAnswer: 3
          },
          {
            id: 2,
            question: 'What is the output of console.log(typeof null)?',
            options: ['null', 'undefined', 'object', 'number'],
            correctAnswer: 2
          },
          {
            id: 3,
            question: 'What is a closure in JavaScript?',
            options: ['A function that has access to variables in its outer scope', 'A way to close a program', 'A type of loop', 'A method to end a function'],
            correctAnswer: 0
          }
        ]
      },
      {
        _id: 'python-fundamentals',
        title: 'Python Fundamentals',
        category: 'programming',
        description: 'Basic Python programming concepts',
        questions: [
          {
            id: 1,
            question: 'What is the correct way to create a function in Python?',
            options: ['function myFunction():', 'def myFunction():', 'create myFunction():', 'func myFunction():'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'What is the output of print(type([]))?',
            options: ['<class \'list\'>', '<class \'array\'>', '<class \'tuple\'>', '<class \'set\'>'],
            correctAnswer: 0
          },
          {
            id: 3,
            question: 'What is a list comprehension in Python?',
            options: ['A way to create lists using a compact syntax', 'A type of loop', 'A method to sort lists', 'A way to delete list items'],
            correctAnswer: 0
          }
        ]
      },
      {
        _id: 'web-development',
        title: 'Web Development',
        category: 'programming',
        description: 'HTML, CSS, and web technologies',
        questions: [
          {
            id: 1,
            question: 'What does HTML stand for?',
            options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
            correctAnswer: 0
          },
          {
            id: 2,
            question: 'What is the purpose of CSS?',
            options: ['To create databases', 'To style web pages', 'To write JavaScript', 'To create server-side logic'],
            correctAnswer: 1
          },
          {
            id: 3,
            question: 'What is the box model in CSS?',
            options: ['A way to create boxes', 'Content, padding, border, and margin', 'A type of layout', 'A method to center elements'],
            correctAnswer: 1
          }
        ]
      }
    ]);
  }
} 