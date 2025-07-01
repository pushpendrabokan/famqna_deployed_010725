import React from 'react';
import { MessageSquare, Clock, CheckCircle, DollarSign, HelpCircle } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import QuestionCard from '../../question/QuestionCard';
import { Question } from '../../../types';

interface OverviewProps {
  stats: {
    totalQuestions: number;
    pendingQuestions: number;
    answeredQuestions: number;
    redeemedIncome: number;
  };
  questions: Question[];
  isLoading: boolean;
  onViewAllQuestions: () => void;
  onAnswerSubmit: (questionId: string, answer: string) => Promise<void>;
  onQuestionUpdate?: (updatedQuestion: Question) => void;
}

const Overview: React.FC<OverviewProps> = ({
  stats,
  questions,
  isLoading,
  onViewAllQuestions,
  onAnswerSubmit,
  onQuestionUpdate
}) => {
  // Filter and sort recent unanswered questions
  const recentUnansweredQuestions = questions
    .filter(q => q.status === 'pending')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 12);

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      {/* Stats cards - Optimized for mobile with 2x2 grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
        {/* Using more compact cards for mobile */}
        <Card className="bg-dark-100">
          <div className="flex items-center">
            <div className="rounded-lg p-2 lg:p-3 bg-primary/20 mr-3 lg:mr-4">
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <div>
              <p className="text-light-300 text-xs lg:text-sm">Total Questions</p>
              <p className="text-xl lg:text-2xl font-bold text-white">{stats.totalQuestions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-100">
          <div className="flex items-center">
            <div className="rounded-lg p-2 lg:p-3 bg-accent-blue/20 mr-3 lg:mr-4">
              <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-accent-blue" />
            </div>
            <div>
              <p className="text-light-300 text-xs lg:text-sm">Pending</p>
              <p className="text-xl lg:text-2xl font-bold text-white">{stats.pendingQuestions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-100">
          <div className="flex items-center">
            <div className="rounded-lg p-2 lg:p-3 bg-accent-green/20 mr-3 lg:mr-4">
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-accent-green" />
            </div>
            <div>
              <p className="text-light-300 text-xs lg:text-sm">Answered</p>
              <p className="text-xl lg:text-2xl font-bold text-white">{stats.answeredQuestions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-100">
          <div className="flex items-center">
            <div className="rounded-lg p-2 lg:p-3 bg-accent-pink/20 mr-3 lg:mr-4">
              <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-accent-pink" />
            </div>
            <div>
              <p className="text-light-300 text-xs lg:text-sm">Redeemed Income</p>
              <p className="text-xl lg:text-2xl font-bold text-white">₹{stats.redeemedIncome}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="w-full">
        <Card className="bg-dark-100">
          <h3 className="text-lg font-medium text-white mb-6">Recent New Questions</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentUnansweredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {recentUnansweredQuestions.map(question => (
                <QuestionCard 
                  key={question.id} 
                  question={question} 
                  isCreator={true}
                  onAnswerSubmit={onAnswerSubmit}
                  onQuestionUpdate={onQuestionUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-light-300 mx-auto mb-4" />
              <p className="text-light-300">No new questions yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Overview;