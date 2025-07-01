import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle } from 'lucide-react';
import Card from '../../ui/Card';
import QuestionCard from '../../question/QuestionCard';
import { Question } from '../../../types';

interface QuestionsProps {
  questions: Question[];
  questionFilter: 'all' | 'pending' | 'answered';
  onFilterChange: (filter: 'all' | 'pending' | 'answered') => void;
  onAnswerSubmit: (questionId: string, answer: string) => Promise<void>;
  onQuestionUpdate?: (updatedQuestion: Question) => void;
}

const ITEMS_PER_PAGE = 12;

const Questions: React.FC<QuestionsProps> = ({
  questions,
  questionFilter,
  onFilterChange,
  onAnswerSubmit,
  onQuestionUpdate
}) => {
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastQuestionElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const newQuestions = questions.slice(startIndex, endIndex);
    setDisplayedQuestions(newQuestions);
    setHasMore(endIndex < questions.length);
  }, [questions, page]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [questionFilter]);

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Questions</h2>
        <div className="sm:ml-auto">
          <select 
            className="w-full sm:w-auto bg-deep-200 border border-gray-600 rounded-lg text-light-100 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={questionFilter}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'pending' | 'answered')}
          >
            <option value="all">All Questions</option>
            <option value="pending">Pending</option>
            <option value="answered">Answered</option>
          </select>
        </div>
      </div>
      
      {displayedQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayedQuestions.map((question, index) => (
            <div 
              key={question.id}
              ref={index === displayedQuestions.length - 1 ? lastQuestionElementRef : undefined}
            >
              <QuestionCard 
                question={question} 
                isCreator={true}
                onAnswerSubmit={onAnswerSubmit}
                onQuestionUpdate={onQuestionUpdate}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-deep-100 py-8 sm:py-12">
          <div className="text-center px-4">
            <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16 text-light-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No Questions Yet</h3>
            <p className="text-light-300 text-sm sm:text-base">You haven't received any questions yet. Questions from users will appear here.</p>
          </div>
        </Card>
      )}
      
      {hasMore && displayedQuestions.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Questions;