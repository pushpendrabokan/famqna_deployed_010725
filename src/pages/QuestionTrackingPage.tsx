import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getQuestionByTrackingId } from '../lib/firestore';
import Button from '../components/ui/Button';
import { Question } from '../types';
import QuestionCard from '../components/question/QuestionCard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const QuestionTrackingPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('71:59:59');
  
  useEffect(() => {
    const loadQuestion = async () => {
      if (!trackingId) return;
      
      try {
        const questionData = await getQuestionByTrackingId(trackingId);
        setQuestion(questionData);
      } catch (error) {
        console.error('Error loading question:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestion();
    
    // Simulate countdown timer
    const endTime = new Date().getTime() + (72 * 60 * 60 * 1000); // 72 hours
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [trackingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-deep-400 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-deep-100 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Question Not Found</h1>
          <p className="text-light-300 mb-6">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button variant="ghost" fullWidth>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-400 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-deep-100 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white text-center mb-6">Question Status</h1>
            
            <div className="bg-deep-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-light-300 mb-2">Tracking ID</p>
              <p className="text-lg font-mono text-white">{trackingId}</p>
            </div>
            
            <div className="space-y-4">
              {question.status === 'pending' && (
                <>
                  <div className="flex items-center gap-3 text-accent-yellow">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <div>
                      <p className="font-medium text-white">Waiting for Answer</p>
                      <p className="text-sm text-light-300">Time remaining: {timeLeft}</p>
                    </div>
                  </div>
                  <div className="bg-deep-200 rounded-lg p-4 text-sm text-light-300">
                    <p>If not answered within 72 hours, you'll receive an automatic refund.</p>
                  </div>
                </>
              )}
              
              {question.status === 'answered' && (
                <>
                  <div className="flex items-center gap-3 text-accent-green mb-6">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <p className="font-medium text-white">Question Answered!</p>
                      <p className="text-sm text-light-300">Check your email for the notification.</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <QuestionCard 
                      question={question}
                      isPublicProfile={true}
                    />
                  </div>
                </>
              )}
              
              {question.status === 'refunded' && (
                <div className="flex items-center gap-3 text-accent-pink">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <p className="font-medium text-white">Refund Processed</p>
                    <p className="text-sm text-light-300">Amount has been refunded to your payment method.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/">
                <Button variant="ghost" fullWidth>
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionTrackingPage;