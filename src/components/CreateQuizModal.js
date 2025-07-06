'use client';

import { useState } from 'react';
import Modal, { FormInput, FormTextarea, FormSelect, Button } from './Modal';
import { createQuizFormSchema, createQuestionFormSchema } from '@/lib/schemas';
import { Plus, Trash2, Save, X } from 'lucide-react';

const CreateQuizModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    difficulty: 'medium',
    timeLimit: '',
    passingScore: 70,
    isPublic: true,
    tags: []
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    }
  ]);

  const [errors, setErrors] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'history', label: 'History' },
    { value: 'science', label: 'Science' },
    { value: 'math', label: 'Mathematics' },
    { value: 'programming', label: 'Programming' },
    { value: 'literature', label: 'Literature' },
    { value: 'geography', label: 'Geography' },
    { value: 'art', label: 'Art & Culture' },
    { value: 'sports', label: 'Sports' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const handleInputChange = (field, value) => {
    // Convert numeric fields to numbers
    let processedValue = value;
    if (field === 'timeLimit' || field === 'passingScore') {
      processedValue = value === '' ? '' : parseInt(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    // Convert numeric fields to numbers
    let processedValue = value;
    if (field === 'points' || field === 'correctAnswer') {
      processedValue = parseInt(value) || 0;
    }
    
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: processedValue
    };
    setQuestions(updatedQuestions);

    if (questionErrors[`${questionIndex}-${field}`]) {
      setQuestionErrors(prev => ({ ...prev, [`${questionIndex}-${field}`]: '' }));
    }
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions.map((q, i) => ({ ...q, id: i + 1 })));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newQuestionErrors = {};

    try {
      createQuizFormSchema.parse(formData);
    } catch (error) {
      error.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
    }

    questions.forEach((question, index) => {
      try {
        createQuestionFormSchema.parse(question);
      } catch (error) {
        error.errors.forEach(err => {
          newQuestionErrors[`${index}-${err.path[0]}`] = err.message;
        });
      }
    });

    setErrors(newErrors);
    setQuestionErrors(newQuestionErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(newQuestionErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const quizData = {
        ...formData,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
        passingScore: parseInt(formData.passingScore),
        questions: questions.map(q => ({
          ...q,
          points: parseInt(q.points)
        }))
      };

      await onSave(quizData);
      handleClose();
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      difficulty: 'medium',
      timeLimit: '',
      passingScore: 70,
      isPublic: true,
      tags: []
    });
    setQuestions([
      {
        id: 1,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1
      }
    ]);
    setErrors({});
    setQuestionErrors({});
    setTagInput('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Quiz" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Quiz Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Quiz Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            placeholder="Enter quiz title"
            required
          />
          
          <FormSelect
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            options={categories}
            error={errors.category}
            placeholder="Select a category"
            required
          />
        </div>

        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          placeholder="Describe your quiz"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Difficulty"
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            options={difficulties}
            error={errors.difficulty}
          />
          
          <FormInput
            label="Time Limit (minutes)"
            type="number"
            value={formData.timeLimit}
            onChange={(e) => handleInputChange('timeLimit', e.target.value)}
            error={errors.timeLimit}
            placeholder="Optional"
            min="1"
            max="180"
          />
          
          <FormInput
            label="Passing Score (%)"
            type="number"
            value={formData.passingScore}
            onChange={(e) => handleInputChange('passingScore', e.target.value)}
            error={errors.passingScore}
            min="1"
            max="100"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} type="button" size="md">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
            <Button onClick={addQuestion} type="button" variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Question {question.id}</h4>
                  {questions.length > 1 && (
                    <Button
                      onClick={() => removeQuestion(questionIndex)}
                      type="button"
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <FormTextarea
                    label="Question"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                    error={questionErrors[`${questionIndex}-question`]}
                    placeholder="Enter your question"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Points"
                      type="number"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(questionIndex, 'points', e.target.value)}
                      error={questionErrors[`${questionIndex}-points`]}
                      min="1"
                      required
                    />
                    
                    <FormTextarea
                      label="Explanation (Optional)"
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                      error={questionErrors[`${questionIndex}-explanation`]}
                      placeholder="Explain the correct answer"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button onClick={handleClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateQuizModal; 