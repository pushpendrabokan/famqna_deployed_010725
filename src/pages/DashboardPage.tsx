import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCreatorQuestions, updateQuestion, getCreatorByUsername, updateUser } from '../lib/firestore';
import OnboardingContainer from '../components/onboarding/OnboardingContainer';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNotificationManager } from '../components/notifications/NotificationManager';

// Import tab components
import Overview from '../components/dashboard/tabs/Overview';
import Questions from '../components/dashboard/tabs/Questions';
import Profile from '../components/dashboard/tabs/Profile';
import Income from '../components/dashboard/tabs/Income';
import Payments from '../components/dashboard/tabs/Payments';
import Settings from '../components/dashboard/tabs/Settings';
import Share from '../components/dashboard/tabs/Share';

import { Creator, Question, User } from '../types';
import { submitAnswer } from '../services/QuestionService';

type TabType = 'home' | 'questions' | 'profile' | 'income' | 'payments' | 'settings' | 'share' | 'onboarding';

const DashboardPage: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [creatorData, setCreatorData] = useState<Creator | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionFilter, setQuestionFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const { showNotification, isPermissionGranted, requestPermission } = useNotificationManager();

  // Get active tab from current path
  const getActiveTab = (): TabType => {
    const path = location.pathname.split('/').pop() || 'home';
    return path as TabType;
  };

  const [activeTab, setActiveTab] = useState<TabType>(getActiveTab());

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get creator data
        if (currentUser?.username) {
          const creator = await getCreatorByUsername(currentUser.username);
          setCreatorData(creator);
          
          // Check if onboarding is needed
          if (creator && (!creator.dateOfBirth || !creator.phone || !creator.bankDetails || !creator.kycDetails)) {
            setActiveTab('onboarding');
          }
        }

        // Get all questions for the creator
        const allQuestions = await getCreatorQuestions(currentUser?.id || '');
        // Filter to only show questions with completed payments
        const paidQuestions = allQuestions.filter(q => q.paymentId);
        setQuestions(paidQuestions);
        
        // Request notification permission if not already granted
        if (!isPermissionGranted) {
          await requestPermission();
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification({
          title: "Error",
          message: "Failed to load dashboard data. Please try again.",
          type: 'error',
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      loadDashboardData();
    }
  }, [currentUser?.id, currentUser?.username, isPermissionGranted, requestPermission]);
  
  // If not logged in, redirect to sign in page
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // If creator data is not loaded yet, show loading
  if (!creatorData && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Handle answering questions
  const handleAnswerSubmit = async (questionId: string, answer: string): Promise<void> => {
    try {
      await submitAnswer(questionId, answer);
      
      // Update local state immediately
      const updatedQuestions = questions.map(q => 
        q.id === questionId ? { 
          ...q, 
          answer, 
          status: 'answered' as const,
          answeredAt: new Date()
        } : q
      );
      setQuestions(updatedQuestions);
      
      showNotification({
        title: 'Answer Submitted',
        message: 'Your answer has been submitted successfully',
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      
      showNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit answer',
        type: 'error',
        duration: 5000
      });
    }
  };

  // Handle question updates
  const handleQuestionUpdate = (updatedQuestion: Question): void => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  };

  // Filter questions based on payment status and selected filter
  const filteredQuestions = questions.filter(q => {
    if (questionFilter === 'pending') return q.status === 'pending';
    if (questionFilter === 'answered') return q.status === 'answered';
    return true;
  });
  
  // Calculate stats from actual questions
  const stats = {
    totalQuestions: filteredQuestions.length,
    pendingQuestions: filteredQuestions.filter(q => q.status === 'pending').length,
    answeredQuestions: filteredQuestions.filter(q => q.status === 'answered').length,
    redeemedIncome: filteredQuestions.filter(q => q.status === 'answered')
      .reduce((sum, q) => sum + (q.price * 0.8), 0), // 80% share of answered questions
    responseRate: filteredQuestions.length > 0 
      ? Math.round((filteredQuestions.filter(q => q.status === 'answered').length / filteredQuestions.length) * 100)
      : 0
  };
  
  const handleProfileUpdate = async (data: Partial<Creator>): Promise<void> => {
    try {
      // Update in Firestore
      await updateUser(currentUser?.id || '', data);
      
      // Fetch fresh data from Firestore to ensure we have the latest state
      if (currentUser?.username) {
        const updatedCreator = await getCreatorByUsername(currentUser.username);
        if (updatedCreator) {
          setCreatorData(updatedCreator);
        }
      }
      
      showNotification({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      showNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        type: 'error',
        duration: 5000
      });
    }
  };

  // Calculate income stats
  const calculateIncomeStats = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    return questions.reduce((acc, question) => {
      if (question.status === 'answered' && question.price) {
        const answerDate = new Date(question.answeredAt || '');
        const amount = question.price * 0.8; // 80% share

        // Total income
        acc.totalIncome += amount;

        // This month's income
        if (answerDate >= firstDayOfMonth && answerDate <= today) {
          acc.incomeThisMonth += amount;
        }

        // Last month's income
        if (answerDate >= firstDayOfLastMonth && answerDate <= lastDayOfLastMonth) {
          acc.incomeLastMonth += amount;
        }
      }
      return acc;
    }, {
      totalIncome: 0,
      incomeThisMonth: 0,
      incomeLastMonth: 0
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return creatorData ? (
          <OnboardingContainer
            creator={creatorData}
            onComplete={() => setActiveTab('home')}
          />
        ) : null;
        
      case 'home':
        return (
          <Overview
            stats={stats}
            questions={questions}
            isLoading={isLoading}
            onViewAllQuestions={() => setActiveTab('questions')}
            onAnswerSubmit={handleAnswerSubmit}
            onQuestionUpdate={handleQuestionUpdate}
          />
        );
        
      case 'questions':
        return (
          <Questions
            questions={filteredQuestions}
            questionFilter={questionFilter}
            onFilterChange={setQuestionFilter}
            onAnswerSubmit={handleAnswerSubmit}
            onQuestionUpdate={handleQuestionUpdate}
          />
        );

      case 'profile':
        return creatorData && (
          <Profile
            currentUser={creatorData}
            onSave={handleProfileUpdate}
          />
        );
        
      case 'income':
        return (
          <Income 
            stats={calculateIncomeStats()}
          />
        );

      case 'payments':
        return creatorData && (
          <Payments
            creator={creatorData}
            onUpdateBank={() => setActiveTab('onboarding')}
            onUpdateKYC={() => setActiveTab('onboarding')}
          />
        );
        
      case 'settings':
        return creatorData && (
          <Settings
            currentUser={creatorData}
            onSave={handleProfileUpdate}
          />
        );
        
      case 'share':
        return (
          <Share
            currentUser={creatorData || currentUser}
          />
        );
        

        
      default:
        return <Navigate to="/dashboard/home" replace />;
    }
  };
  
  return (
    <DashboardLayout
      currentUser={creatorData || currentUser}
      activeTab={activeTab === 'onboarding' ? 'home' : activeTab}
      onTabChange={(tab: string) => {
        setActiveTab(tab as TabType);
      }}
      onSignOut={signOut}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>{renderTabContent()}</div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;