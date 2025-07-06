'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Sparkles, Clock, Brain } from 'lucide-react';

export default function QuizComponent({ quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, { questionIndex: currentQuestionIndex, selected: selectedAnswer, correct: isCorrect }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setIsTimerRunning(false);
    setQuizCompleted(true);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(300);
    setIsTimerRunning(true);
  };

  const getAnswerStatus = (answerIndex) => {
    if (selectedAnswer === null) return '';
    if (answerIndex === currentQuestion.correctAnswer) return 'correct';
    if (answerIndex === selectedAnswer && answerIndex !== currentQuestion.correctAnswer) return 'incorrect';
    return '';
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  if (quizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <div className="min-h-screen p-4 sm:p-8 gradient-bg">
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
            <div className="relative z-10">
              <div className="mb-6">
                {isPassing ? (
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center animate-bounce">
                    <Trophy className="w-10 h-10 text-green-600 dark:text-green-300" />
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-300" />
                  </div>
                )}
                
                <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                  Quiz Complete!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {quiz.title}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-6xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                  {score}/{quiz.questions.length}
                </div>
                <div className="text-2xl font-semibold mb-4 text-gray-600 dark:text-gray-400">
                  {percentage}%
                </div>
                <div className={`text-lg font-medium ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isPassing ? 'Great job! You passed!' : 'Keep practicing!'}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Question Summary
                </h3>
                <div className="space-y-2">
                  {answers.map((answer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <span className="text-gray-700 dark:text-gray-300">
                        Question {index + 1}
                      </span>
                      {answer.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestartQuiz}
                  className="ios-button flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </button>
                <Link
                  href="/"
                  className="ios-button flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 gradient-bg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="glass-effect p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/"
                  className="ios-button flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Categories
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {quiz.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {quiz.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="ios-progress w-full h-2 mb-4">
                <div
                  className="ios-progress-bar h-2"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
            </div>
          </div>
        </header>

        {/* Question */}
        <main>
          <div className="glass-effect p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left ios-input transition-all duration-200 ${
                      selectedAnswer === index
                        ? getAnswerStatus(index) === 'correct'
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                          : getAnswerStatus(index) === 'incorrect'
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                          : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                    } ${
                      selectedAnswer !== null && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? getAnswerStatus(index) === 'correct'
                            ? 'border-green-500 bg-green-500'
                            : getAnswerStatus(index) === 'incorrect'
                            ? 'border-red-500 bg-red-500'
                            : 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedAnswer === index && (
                          getAnswerStatus(index) === 'correct' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : getAnswerStatus(index) === 'incorrect' ? (
                            <XCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )
                        )}
                        {selectedAnswer !== null && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedAnswer !== null && (
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400">Incorrect</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`ios-button ${
                selectedAnswer === null
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
} 