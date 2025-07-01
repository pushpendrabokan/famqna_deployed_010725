import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp();

// Improved CORS configuration with better handling
const corsHandler = cors({ 
  origin: true, // Allow requests from any origin
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
});

// Define interfaces for function data
interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  sourceId?: string;
  sourceType?: string;
  seen?: boolean;
  delivered?: boolean;
  data?: any;
}

interface PushNotificationData {
  userId: string;
  title: string;
  body: string;
  data?: any;
}

interface MarkNotificationSeenData {
  notificationId?: string;
  sourceId?: string;
}

// Create notification function
export const createNotification = functions.https.onCall(async (request, context) => {
  try {
    const { userId, title, message, type, sourceId, sourceType, data: extraData } = request.data;
    
    if (!userId || !title || !message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: userId, title, or message'
      );
    }

    // Create notification document
    const notification = {
      userId,
      title,
      message,
      type: type || 'info',
      sourceId: sourceId || null,
      sourceType: sourceType || null,
      seen: false,
      delivered: false,
      pushSent: false,
      pushError: null,
      data: extraData || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add to Firestore
    const db = admin.firestore();
    const notificationRef = await db.collection('user_notifications').add(notification);
    
    console.log('Notification created successfully:', notificationRef.id);
    
    // Send push notification
    try {
      await sendPushNotification({
        userId,
        title,
        body: message,
        data: extraData
      });
    } catch (pushError) {
      console.error('Failed to send push notification:', pushError);
      // Update notification with push error
      await notificationRef.update({
        pushError: pushError instanceof Error ? pushError.message : 'Unknown push error'
      });
    }

    return {
      success: true,
      notificationId: notificationRef.id
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to create notification'
    );
  }
});

// Send push notification function
async function sendPushNotification(data: PushNotificationData) {
  try {
    const { userId, title, body, data: extraData } = data;
    
    // Get user's FCM token from Firestore
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken || userData?.notificationPreferences?.token;
    
    if (!fcmToken) {
      console.log('No FCM token found for user:', userId);
      return;
    }

    // Send FCM message
    const message = {
      token: fcmToken,
      notification: {
        title,
        body
      },
      data: {
        ...extraData,
        click_action: extraData?.url || '/dashboard'
      }
    };

    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// Mark notification as seen
export const markNotificationSeen = functions.https.onCall(async (request, context) => {
  try {
    const { notificationId, sourceId } = request.data;
    
    if (!notificationId && !sourceId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Either notificationId or sourceId must be provided'
      );
    }

    const db = admin.firestore();
    
    if (notificationId) {
      // Mark specific notification as seen
      await db.collection('user_notifications').doc(notificationId).update({
        seen: true,
        seenAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else if (sourceId) {
      // Mark all notifications with this sourceId as seen
      const notifications = await db.collection('user_notifications')
        .where('sourceId', '==', sourceId)
        .get();
      
      const batch = db.batch();
      notifications.docs.forEach(doc => {
        batch.update(doc.ref, {
          seen: true,
          seenAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as seen:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to mark notification as seen'
    );
  }
});

// Placeholder for future PayU integration
export const createPayUOrder = functions.https.onCall(async (request, context) => {
  // TODO: Implement PayU order creation
  throw new functions.https.HttpsError(
    'unimplemented',
    'PayU integration will be implemented in the future'
  );
});

export const verifyPayUPayment = functions.https.onCall(async (request, context) => {
  // TODO: Implement PayU payment verification
  throw new functions.https.HttpsError(
    'unimplemented',
    'PayU payment verification will be implemented in the future'
  );
});