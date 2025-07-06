'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy, RefreshCw } from 'lucide-react';
import QuizComponent from './QuizComponent';

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  return {
    title: `Quiz - Micro-Quiz Platform`,
    description: 'Test your knowledge with our interactive quiz',
  };
}

export default function QuizPage({ params }) {
  const { id } = params;
  const router = useRouter();
  
  // Client-side state management
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz data on component mount
  useEffect(() => {
    fetchQuizData();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      completeQuiz();
    }
  }, [timeLeft, isQuizComplete]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quizzes/quiz/${id}`);
      if (response.ok) {
        const quizData = await response.json();
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
        setUserAnswers(new Array(quizData.questions.length).fill(null));
      } else {
        setError('Quiz not found');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isQuizComplete || showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    // Save user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    // Show feedback
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      
      // Move to next question or complete quiz
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        completeQuiz();
      }
    }, 2000);
  };

  const completeQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsQuizComplete(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
    setScore(0);
    setIsQuizComplete(false);
    setShowFeedback(false);
    setTimeLeft(quiz.timeLimit * 60);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="glass-effect p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="glass-effect p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen p-4 sm:p-8 gradient-bg">
      {/* Header */}
      <header className="mb-8">
        <div className="glass-effect p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto">
        {!isQuizComplete ? (
          <div className="glass-effect p-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>
              
              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      showFeedback
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : selectedAnswer === index && index !== currentQuestion.correctAnswer
                          ? 'border-red-500 bg-red-50'
                          : ''
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                      {showFeedback && (
                        <div className="ml-auto">
                          {index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : selectedAnswer === index && index !== currentQuestion.correctAnswer ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                  </span>
                </div>
                {currentQuestion.explanation && (
                  <p className="text-sm text-gray-600 mt-2">{currentQuestion.explanation}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <div className="text-sm text-gray-600">
                Progress: {currentQuestionIndex + 1} / {quiz.questions.length}
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null || showFeedback}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Results */
          <div className="glass-effect p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600 mb-4">Your final score</p>
              <div className="text-4xl font-bold text-blue-600 mb-4">{score}%</div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{quiz.questions.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round((score / 100) * quiz.questions.length)}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 