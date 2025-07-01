import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { getCreatorByUsername, getCreatorQuestions, createQuestion, updateQuestion, deleteQuestion } from '../lib/firestore';
import { notifyNewQuestion } from '../services/QuestionService';
import Button from '../components/ui/Button';
import GuestQuestionForm from '../components/question/GuestQuestionForm';
import QuestionCard from '../components/question/QuestionCard';
import { useAuth } from '../hooks/useAuth';
import { Creator, Question } from '../types';
import { useNotificationManager } from '../components/notifications/NotificationManager';
import { requestNotificationPermission } from '../serviceWorkerRegistration';

const QUESTIONS_PER_PAGE = 10;
const SCROLL_TRIGGER_INDEX = 8;

const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastQuestionTimestamp, setLastQuestionTimestamp] = useState<Date | null>(null);
  const { showNotification } = useNotificationManager();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Update the intersection observer to check for the 8th question
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only load more if we're at or past the 8th question
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && questions.length >= SCROLL_TRIGGER_INDEX) {
          loadMoreQuestions();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, questions.length]);

  const loadMoreQuestions = async () => {
    if (!creator || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const moreQuestions = await getCreatorQuestions(
        creator.id,
        QUESTIONS_PER_PAGE,
        lastQuestionTimestamp || undefined,
        {
          status: 'answered',
          isPrivate: false,
          requirePayment: true
        }
      );

      if (moreQuestions.length < QUESTIONS_PER_PAGE) {
        setHasMore(false);
      }

      if (moreQuestions.length > 0) {
        setQuestions(prev => [...prev, ...moreQuestions]);
        setLastQuestionTimestamp(moreQuestions[moreQuestions.length - 1].createdAt);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more questions:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const loadCreatorData = async () => {
      if (!username) return;

      try {
        setError(null);
        const creatorData = await getCreatorByUsername(username);
        
        if (!creatorData) {
          setError('Creator not found');
          setCreator(null);
          return;
        }
        
        creatorData.publicPrice = Number(creatorData.publicPrice || 0);
        creatorData.privatePrice = Number(creatorData.privatePrice || 0);
        setCreator(creatorData);
        
        // Get initial batch of questions with filters
        const initialQuestions = await getCreatorQuestions(
          creatorData.id,
          QUESTIONS_PER_PAGE,
          undefined,
          {
            status: 'answered',
            isPrivate: false,
            requirePayment: true
          }
        );

        if (initialQuestions.length > 0) {
          setQuestions(initialQuestions);
          setLastQuestionTimestamp(initialQuestions[initialQuestions.length - 1].createdAt);
          // Set hasMore based on whether we got a full page and if we're at/past the trigger index
          setHasMore(
            initialQuestions.length === QUESTIONS_PER_PAGE && 
            initialQuestions.length >= SCROLL_TRIGGER_INDEX
          );
        } else {
          setHasMore(false);
        }
        
      } catch (error) {
        setError('Failed to load creator data');
        console.error('Error loading creator data:', error);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCreatorData();
  }, [username]);
  
  const handleGuestQuestionSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    question: string;
    type: 'public' | 'private';
  }) => {
    if (!creator) return;
    
    // Prevent duplicate submissions
    if (isSubmitting) {
      console.log('Submission already in progress, preventing duplicate');
      return;
    }

    try {
      // Set submission state to prevent multiple submissions
      setIsSubmitting(true);
      
      // Get price based on question type
      const price = data.type === 'public' ? creator.publicPrice : creator.privatePrice;
      // Generate a unique tracking ID based on timestamp for additional uniqueness
      const trackingId = 'QNA' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      // Create the question
      const questionData = {
        creatorId: creator.id,
        userName: data.name,
        userPhoto: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name),
        userId: 'guest_' + Math.random().toString(36).substr(2),
        content: data.question.trim(),
        isPrivate: data.type === 'private',
        price: Number(price),
        status: 'pending' as const,
        createdAt: new Date(),
        guestEmail: data.email,
        guestPhone: data.phone,
        trackingId: trackingId
      };

      const questionId = await createQuestion(questionData);

      // For now, we'll treat all questions as successfully submitted
      // PayU payment processing will be integrated later
      
      // Send notification to creator about new question
      console.log('Sending notification for new question:', questionId);
      await notifyNewQuestion(
        creator.id,
        data.name,
        data.question,
        questionId
      );
      
      // Show success notification to the asker
      showNotification({
        title: 'Question Submitted',
        message: 'Your question has been submitted successfully. Payment processing will be available soon.',
        type: 'success',
        duration: 5000
      });
      
      // Navigate to success page
      navigate('/question/success', {
        state: {
          creator,
          trackingId,
          paymentId: 'pending_payment_integration'
        }
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      
      // Show error notification
      showNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit question',
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setShowGuestForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-deep-400 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">{error || 'Creator Not Found'}</h1>
          <p className="text-light-300 mb-6">
            {error === 'Creator not found' 
              ? "The creator you're looking for doesn't exist or has been removed."
              : 'An error occurred while loading the creator data. Please try again later.'}
          </p>
          <Link to="/">
            <Button variant="gradient">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-400">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Creator info header - center aligned */}
        <div className="mb-8 text-center">
          {/* Profile image - centered with animated border */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-glow animate-pulse">
              <img 
                src={creator.photoURL || 'https://via.placeholder.com/150'} 
                alt={creator.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Creator info */}
          <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-br from-accent-purple via-primary to-accent-pink bg-clip-text text-transparent">
            {creator.name}
          </h1>
          <p className="text-light-300 text-sm">@{creator.username}</p>
          
          {/* Social links - centered with animations */}
          <div className="flex justify-center gap-4 mt-3">
            {creator.twitter && (
              <a href={creator.twitter} target="_blank" rel="noopener noreferrer" className="text-light-300 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {creator.instagram && (
              <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="text-light-300 hover:text-secondary transition-all duration-300 transform hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {creator.linkedin && (
              <a href={creator.linkedin} target="_blank" rel="noopener noreferrer" className="text-light-300 hover:text-accent-indigo transition-all duration-300 transform hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {creator.website && (
              <a href={creator.website} target="_blank" rel="noopener noreferrer" className="text-light-300 hover:text-accent-teal transition-all duration-300 transform hover:-translate-y-1">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
          
          {/* Bio - center aligned text */}
          <div className="mt-4 max-w-md mx-auto">
            <p className="text-light-200 text-sm leading-relaxed">{creator.bio}</p>
            
            <Button 
              variant="gradient" 
              size="md"
              fullWidth
              leftIcon={<MessageCircle className="w-4 h-4" />}
              onClick={() => setShowGuestForm(true)}
              className="mt-4"
            >
              Ask a Question
            </Button>
          </div>
        </div>
        
        {/* Guest Question Form */}
        {showGuestForm && creator && (
          <GuestQuestionForm
            creator={creator}
            onClose={() => setShowGuestForm(false)}
            onSubmit={handleGuestQuestionSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        
        {/* Public Q&A feed */}
        <div className="mb-16 mt-8">
          <h2 className="text-2xl font-bold mb-5 text-center text-white">Public Q&A</h2>
          
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <React.Fragment key={question.id}>
                  <QuestionCard 
                    question={question} 
                    isPublicProfile={true}
                  />
                  {/* Place the observer target before the 8th question */}
                  {index === SCROLL_TRIGGER_INDEX - 1 && (
                    <div ref={loadMoreRef} className="h-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-light-200 mb-2">No public questions have been answered yet.</p>
              <p className="text-light-300 text-sm">Be the first to ask a question</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="text-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Create Similar Page Button */}
      {!currentUser && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Link to="/signup">
            <Button 
              variant="gradient" 
              size="sm"
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 px-6 py-3 rounded-full"
              rightIcon={<ExternalLink className="w-4 h-4 ml-2" />}
            >
              Create similar page?
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatorProfilePage;