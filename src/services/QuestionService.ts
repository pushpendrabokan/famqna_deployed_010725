import { 
  createQuestion, 
  updateQuestion, 
  getQuestionById,
  deleteQuestion,
  getUserById
} from '../lib/firestore';
import { db } from '../lib/firebase';
import { Question } from '../types';
import { notificationService, NotificationType } from './NotificationService';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import emailService from './EmailService';

// Define SubmitQuestionParams interface to fix linter error
export interface SubmitQuestionParams {
  askerId: string;
  creatorId: string;
  content: string;
  amount: number;
  askerName?: string;
  askerEmail?: string;
  isPrivate?: boolean;
  asker?: {
    name: string;
    email?: string;
  };
}

// Create a new question - payment processing will be added with PayU later
export const createQuestionWithPayment = async (
  questionData: Omit<Question, 'id' | 'paymentId' | 'orderId' | 'transferId' | 'status' | 'createdAt'>,
  userData: {
    name: string;
    email: string;
    phone: string;
  }
): Promise<{ 
  success: boolean; 
  questionId?: string; 
  trackingId?: string;
  error?: string; 
}> => {
  try {
    // Generate tracking ID
    const trackingId = 'QNA' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Create the question
    const questionWithTrackingId = {
      ...questionData,
      status: 'pending' as const,
      createdAt: new Date(),
      trackingId
    };
    
    const questionId = await createQuestion(questionWithTrackingId);
    
    // For now, we'll treat all questions as successfully created
    // PayU payment processing will be integrated later
    
    // Send notification to creator about new question
    await notifyNewQuestion(
      questionData.creatorId, 
      userData.name,
      questionData.content,
      questionId
    );
    
    return {
      success: true,
      questionId,
      trackingId
    };
  } catch (error) {
    console.error('Error creating question:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create question'
    };
  }
};

// Submit an answer to a question
export const submitAnswer = async (
  questionId: string,
  answer: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the question to get user details
    const question = await getQuestionById(questionId);
    if (!question) {
      return { success: false, error: 'Question not found' };
    }
    
    // Update the question with answer
    await updateQuestion(questionId, {
      answer,
      status: 'answered',
      answeredAt: new Date()
    });
    
    // We no longer send notifications for answers
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting answer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit answer'
    };
  }
};

/**
 * Send notification about a new question to the creator
 */
export async function notifyNewQuestion(
  creatorId: string,
  userName: string,
  questionContent: string,
  questionId: string
): Promise<void> {
  try {
    console.log(`===== NOTIFICATION FLOW START =====`);
    console.log(`Sending notification about new question to creator ${creatorId}`);
    console.log(`Question ID: ${questionId}`);
    console.log(`Asker: ${userName}`);
    
    // Get the first 60 characters of the question for the notification
    const shortContent = questionContent.length > 60 
      ? `${questionContent.substring(0, 60)}...` 
      : questionContent;
    
    // Use Firebase Function to create notification
    const functions = getFunctions();
    console.log('Initialized Firebase Functions');
    
    // First, try to create a notification directly in Firestore as a backup mechanism
    let directNotificationId: string | null = null;
    try {
      console.log('Creating notification directly in Firestore as a backup');
      const notificationData = {
        userId: creatorId,
        title: 'New Question Received',
        message: `${userName} asked: ${shortContent}`,
        type: 'info',
        sourceId: questionId,
        sourceType: 'new-question',
        seen: false,
        delivered: false, // Set to false initially
        pushSent: false, // Track if push was sent
        pushError: null, // Track any push errors
        data: {
          type: NotificationType.NEW_QUESTION,
          questionId,
          url: `/dashboard/questions/${questionId}`
        },
        createdAt: serverTimestamp() // Use serverTimestamp instead of new Date()
      };
      
      console.log('Notification data:', notificationData);
      
      // Add the notification to Firestore
      const db = getFirestore();
      const notificationsRef = collection(db, 'user_notifications');
      const docRef = await addDoc(notificationsRef, notificationData);
      directNotificationId = docRef.id;
      console.log('✅ Backup notification created successfully in Firestore with ID:', docRef.id);
    } catch (directCreateError) {
      console.error('❌ Error creating notification directly in Firestore:', directCreateError);
      // Log the full error details for debugging
      if (directCreateError instanceof Error) {
        console.error('Error details:', {
          message: directCreateError.message,
          stack: directCreateError.stack,
          name: directCreateError.name
        });
      }
    }
    
    // Attempt to create the notification via the Firebase Function
    console.log('Creating notification via Firebase Function');
    const createNotification = httpsCallable<any, any>(functions, 'createNotification');
    
    try {
      const notificationData = {
        userId: creatorId,
        title: 'New Question Received',
        message: `${userName} asked: ${shortContent}`,
        type: 'info',
        sourceId: questionId,
        sourceType: 'new-question',
        deduplicate: true,
        data: {
          type: NotificationType.NEW_QUESTION,
          questionId,
          url: `/dashboard/questions/${questionId}`
        }
      };
      
      console.log('Calling createNotification function with data:', notificationData);
      
      const result = await createNotification(notificationData);
      
      console.log('✅ Notification created via Firebase Function. Response:', result);
      
      // Verify the result
      if (!result.data) {
        throw new Error('Firebase Function returned empty result');
      }
      
      if (result.data.duplicate) {
        console.log('Notification was a duplicate, using existing one:', result.data);
      }
    } catch (functionError) {
      console.error('❌ Firebase Function error:', functionError);
      // Log detailed error information
      if (functionError instanceof Error) {
        console.error('Detailed error:', {
          message: functionError.message,
          stack: functionError.stack,
          name: functionError.name
        });
      }
      
      if (!directNotificationId) {
        console.error('Both notification creation methods failed!');
      }
    }
    
    console.log(`===== NOTIFICATION FLOW COMPLETE =====`);
  } catch (error) {
    console.error('Error in notifyNewQuestion:', error);
    throw error;
  }
}

export const submitQuestion = async (question: SubmitQuestionParams): Promise<{ success: boolean; questionId?: string; error?: string; trackingId?: string }> => {
  try {
    console.log('Submitting question:', question);
    
    // Create a tracking ID for anonymous tracking
    const trackingId = `trk_${Math.random().toString(36).substring(2, 15)}`;
    
    // Create the question in Firestore with proper fields matching Question type
    const questionData: Omit<Question, 'id'> = {
      creatorId: question.creatorId,
      userId: question.askerId,
      userName: question.askerName || 'Anonymous',
      userPhoto: '', // Default empty photo
      content: question.content,
      isPrivate: question.isPrivate || false,
      price: question.amount,
      status: 'pending' as 'pending' | 'answered' | 'refunded',
      createdAt: new Date(),
      trackingId: trackingId,
      guestEmail: question.askerEmail || undefined
    };
    
    const questionId = await createQuestion(questionData);
    console.log(`Created question with ID: ${questionId}`);
    
    // Get creator details for notifications
    const creator = await getUserById(question.creatorId);
    const creatorName = creator?.name || 'Creator';
    
    // Send notification to creator about new question
    if (question.askerName) {
      await notifyNewQuestion(
        question.creatorId,
        question.askerName,
        question.content,
        questionId
      );
    }
    
    // Send email notification to the user
    if (question.askerEmail) {
      try {
        console.log('Sending question created email to:', question.askerEmail);
        await emailService.sendQuestionCreatedEmail(
          question.askerId,
          question.askerEmail,
          question.askerName || 'User',
          questionId,
          question.content,
          creatorName
        );
        console.log('Question created email sent to:', question.askerEmail);
      } catch (error) {
        console.error('Error sending question created email:', error);
      }
    }
    
    // Send SMS notification if phone number is available
    const user = await getUserById(question.askerId);
    if (user?.phone && user.phoneVerified) {
      try {
        console.log('Sending question created SMS to:', user.phone);
        await notificationService.sendQuestionCreatedSMS(
          question.askerId,
          user.phone,
          questionId,
          creatorName
        );
        console.log('Question created SMS sent to:', user.phone);
      } catch (error) {
        console.error('Error sending question created SMS:', error);
      }
    }
    
    return {
      success: true,
      questionId,
      trackingId: trackingId
    };
  } catch (error: any) {
    console.error('Error submitting question:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      trackingId: undefined
    };
  }
};