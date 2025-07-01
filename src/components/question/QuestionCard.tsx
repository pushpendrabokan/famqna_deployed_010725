import React, { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, MessageCircle, Smile, ChevronUp, Edit2, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { Question } from '../../types';
import { submitAnswer } from '../../services/QuestionService';
import { useNotifications } from '../../hooks/useNotifications';
// @ts-ignore
import data from '@emoji-mart/data';
// @ts-ignore
import Picker from '@emoji-mart/react';

interface QuestionCardProps {
  question: Question;
  isCreator?: boolean;
  isPublicProfile?: boolean;
  onAnswerSubmit?: (questionId: string, answer: string) => Promise<void>;
  onQuestionUpdate?: (updatedQuestion: Question) => void;
}

interface EmojiObject {
  native: string;
  id: string;
  name: string;
  unified: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  isCreator = false,
  isPublicProfile = false,
  onAnswerSubmit,
  onQuestionUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answer, setAnswer] = useState(question.answer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { showLocalNotification } = useNotifications();

  // Update local state when question prop changes
  useEffect(() => {
    setAnswer(question.answer || '');
  }, [question.answer]);

  const canEdit = () => {
    if (!question.answeredAt) return false;
    const now = new Date();
    const answerTime = new Date(question.answeredAt);
    const hoursDiff = (now.getTime() - answerTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 6;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return '<1m ago';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays <= 3) {
      return `${diffInDays}d ago`;
    } else {
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onAnswerSubmit) {
        await onAnswerSubmit(question.id, answer.trim());
        
        // Update local state immediately
        const updatedQuestion = {
          ...question,
          answer: answer.trim(),
          status: 'answered' as const,
          answeredAt: new Date()
        };
        
        // Notify parent component about the update
        if (onQuestionUpdate) {
          onQuestionUpdate(updatedQuestion);
        }
      } else {
        // Use the QuestionService if no callback provided
        const result = await submitAnswer(question.id, answer.trim());
        
        if (result.success) {
          showLocalNotification(
            'Answer Submitted',
            'Your answer has been submitted successfully.',
            {
              type: 'question_answered',
              questionId: question.id
            }
          );
          
          // Update local state
          const updatedQuestion = {
            ...question,
            answer: answer.trim(),
            status: 'answered' as const,
            answeredAt: new Date()
          };
          
          if (onQuestionUpdate) {
            onQuestionUpdate(updatedQuestion);
          }
        } else {
          throw new Error(result.error);
        }
      }
      
      setIsEditing(false);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to detect and convert URLs to links
  const processContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary/80 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleEmojiSelect = (emoji: EmojiObject) => {
    setAnswer(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Function to handle content expansion
  const shouldTruncateContent = question.content.length > 100;
  const displayContent = isContentExpanded || !shouldTruncateContent 
    ? question.content 
    : question.content.substring(0, 100) + '...';

  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-full">
      <div className="bg-deep-100 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:bg-deep-200/90 animate-fadeIn border border-gray-700/50 h-full">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={question.userPhoto} 
              alt={question.userName}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white text-sm sm:text-base truncate">
                {truncateText(question.userName, 20)}
              </h3>
              <span className="text-xs sm:text-sm text-light-300">{formatTimeAgo(question.createdAt)}</span>
            </div>
          </div>
          
          {/* Status Badge - Only show in dashboard */}
          {!isPublicProfile && (
            <div className={`flex-shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              question.status === 'answered' 
                ? 'bg-accent-green/10 text-accent-green' 
                : 'bg-accent-blue/10 text-accent-blue'
            }`}>
              {question.status === 'answered' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Answered</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Pending</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Question Content */}
        <div className="mb-4 min-h-[80px]">
          <p className="text-light-100 text-base sm:text-lg leading-relaxed line-clamp-3">
            {processContent(displayContent)}
          </p>
          {shouldTruncateContent && (
            <button
              onClick={() => setIsContentExpanded(!isContentExpanded)}
              className="mt-2 text-primary hover:text-primary/80 text-sm flex items-center gap-1"
            >
              {isContentExpanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Read More <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
        
        {/* Action Button */}
        <div className="flex justify-between items-center mt-auto">
          {/* Only show public/private label in dashboard */}
          {!isPublicProfile && (
            <div className="text-xs sm:text-sm text-light-300">
              {question.isPrivate ? 'Private Question' : 'Public Question'}
            </div>
          )}
          
          {/* Show expand/collapse button for both views */}
          <div className={!isPublicProfile ? 'ml-auto' : 'w-full flex justify-end'}>
            {isExpanded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
                leftIcon={<ChevronUp className="w-4 h-4" />}
              >
                Hide Answer
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(true)}
                leftIcon={<MessageCircle className="w-4 h-4" />}
              >
                {question.status === 'pending' ? 'Answer Question' : 'View Answer'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Answer section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-600 animate-fadeIn">
            {question.status === 'answered' ? (
              <>
                <div className="bg-deep-200 rounded-lg p-4">
                  <p className="text-light-100 whitespace-pre-wrap text-sm sm:text-base">{processContent(question.answer || '')}</p>
                </div>
                <div className="flex items-center text-light-300 text-xs sm:text-sm mt-3">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <span>Answered {formatTimeAgo(question.answeredAt || new Date())}</span>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full bg-deep-200 border border-gray-600 rounded-lg p-4 text-light-100 placeholder-light-300/50 focus:ring-primary focus:border-primary transition-all min-h-[120px] text-sm sm:text-base"
                    placeholder="Type your answer here... You can use emojis and paste links"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  ></textarea>
                </div>
                
                {showEmojiPicker && (
                  <div className="absolute z-10 transform -translate-x-1/2 left-1/2 sm:transform-none sm:left-0">
                    <Picker 
                      data={data} 
                      onEmojiSelect={handleEmojiSelect}
                      theme="dark"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-lg bg-deep-300 hover:bg-deep-400 transition-colors"
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-light-300" />
                  </button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setAnswer('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      disabled={!answer.trim() || isSubmitting}
                      onClick={handleSubmitAnswer}
                      leftIcon={<Send className="w-4 h-4" />}
                      isLoading={isSubmitting}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;