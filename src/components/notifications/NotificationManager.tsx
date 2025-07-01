import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { notificationService, NotificationTopic, NotificationType } from '../../services/NotificationService';
import { useAuth } from '../../hooks/useAuth';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../lib/firebase';

// Define the structure of a notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  seen?: boolean;
  delivered?: boolean;
  createdAt?: Date;
  sourceId?: string; // The ID of the related item (questionId, etc.)
  sourceType?: string; // The type of the source (question, payment, etc.)
}

// Define the context value structure
interface NotificationContextValue {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  isSupported: boolean;
  isPermissionGranted: boolean;
  isPushEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  hasNewNotifications: boolean;
  clearNewNotificationsFlag: () => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// Custom hook for using the notification context
export const useNotificationManager = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationManager must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationManagerProps {
  children: React.ReactNode;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const initialized = useRef(false);
  const seenQuestionIds = useRef<Set<string>>(new Set());
  const processedNotificationIds = useRef<Set<string>>(new Set()); // Track processed notification IDs
  const realtimeListenerSetup = useRef(false); // Track if realtime listener is already set up
  const functions = getFunctions();

  // Initialize notification service on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
      initialized.current = true;
      
      setIsSupported(notificationService.isSupported());
      setIsPermissionGranted(notificationService.isPermissionGranted());
      setIsPushEnabled(notificationService.isPushEnabled());
      
      // Load user's notifications from Firestore
      if (currentUser?.id) {
        loadUserNotifications(currentUser.id);
      }
    }

    // Define the notification handler - creating it here to avoid recreating it on each render
    const handleNotification = (payload: any) => {
      console.log('NotificationManager received notification:', payload);
      
      // Check if this is a question notification and if we've seen it
      if (payload.data?.type === NotificationType.NEW_QUESTION && 
          payload.data?.questionId &&
          seenQuestionIds.current.has(payload.data.questionId)) {
        console.log('Skipping notification for already seen question:', payload.data.questionId);
        return;
      }
      
      const notification = {
        title: payload.title,
        message: payload.body,
        type: 'info' as 'info' | 'success' | 'warning' | 'error',
        duration: 5000,
        sourceId: payload.data?.questionId,
        sourceType: payload.data?.type,
        seen: false,
        createdAt: new Date()
      };
      
      showNotification(notification);
      
      setHasNewNotifications(true);
    };

    // Set up the notification listener
    notificationService.onNotificationReceived(handleNotification);
    
    // Set up direct Firebase messaging listener as well
    onMessage();
    
    // Return cleanup function
    return () => {
      // Set null listener to clean up the previous one
      notificationService.onNotificationReceived(() => {});
    };
  }, []); // Empty dependency array ensures this only runs once on mount
  
  // Setup Firebase messaging onMessage handler
  const onMessage = () => {
    if (notificationService.messaging) {
      console.log('Setting up direct Firebase messaging listener');
      
      // Use the notification service to handle Firebase messages
      notificationService.onNotificationReceived((payload) => {
        console.log('Received foreground message directly:', payload);
        
        // Check if this is a Firebase Cloud Messaging payload
        const fcmPayload = payload as any;
        
        if (fcmPayload.notification && fcmPayload.data) {
          // Only process new question notifications
          if (fcmPayload.data.type === NotificationType.NEW_QUESTION) {
            // Check if we've already seen this question
            if (fcmPayload.data.questionId && seenQuestionIds.current.has(fcmPayload.data.questionId)) {
              console.log('Skipping direct notification for already seen question:', fcmPayload.data.questionId);
              return;
            }
            
            const notification = {
              title: fcmPayload.notification.title || 'New Question',
              message: fcmPayload.notification.body || 'You have received a new question',
              type: 'info' as const,
              duration: 5000,
              sourceId: fcmPayload.data.questionId,
              sourceType: fcmPayload.data.type,
              seen: false,
              createdAt: new Date()
            };
            
            showNotification(notification);
            setHasNewNotifications(true);
          }
        } else {
          // Handle regular notification payload
          if (payload.data?.type === NotificationType.NEW_QUESTION &&
              payload.data?.questionId &&
              seenQuestionIds.current.has(payload.data.questionId)) {
            console.log('Skipping notification for already seen question:', payload.data.questionId);
            return;
          }
          
          const notification = {
            title: payload.title,
            message: payload.body,
            type: 'info' as 'info' | 'success' | 'warning' | 'error',
            duration: 5000,
            sourceId: payload.data?.questionId,
            sourceType: payload.data?.type,
            seen: false,
            createdAt: new Date()
          };
          
          showNotification(notification);
          setHasNewNotifications(true);
        }
      });
    }
  };
  
  // Load user's notifications from Firestore
  const loadUserNotifications = async (userId: string) => {
    try {
      console.log('Loading user notifications from Firestore');
      
      // Get user's notifications - REMOVE the delivered filter to see if any notifications exist
      const notificationsQuery = query(
        collection(db, 'user_notifications'),
        where('userId', '==', userId),
        // Don't filter by delivered status to see all notifications
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      // First, get all existing notifications to populate the seenQuestionIds set
      const initialSnapshot = await getDocs(notificationsQuery);
      console.log(`Loaded ${initialSnapshot.size} initial notifications to populate seen IDs`);
      
      // Clear previous data to prevent duplicates
      seenQuestionIds.current.clear();
      processedNotificationIds.current.clear();
      
      // Process initial notifications and populate the seenQuestionIds set
      const userNotifications: Notification[] = [];
      
      initialSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Processing notification: ${doc.id}`, data);
        
        // Add to processed notifications set to prevent duplicates
        processedNotificationIds.current.add(doc.id);
        
        if (data.sourceId) {
          seenQuestionIds.current.add(data.sourceId);
          console.log(`Added sourceId to seen questions: ${data.sourceId}`);
        }
        
        // If the notification isn't marked as delivered, mark it now
        if (!data.delivered) {
          console.log(`Marking notification ${doc.id} as delivered`);
          updateDoc(doc.ref, { delivered: true }).catch((error: Error) => {
            console.error(`Error marking notification ${doc.id} as delivered:`, error);
          });
        }
        
        const notification: Notification = {
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type,
          seen: data.seen,
          delivered: true, // Always treat as delivered in the UI
          createdAt: data.createdAt?.toDate(),
          sourceId: data.sourceId,
          sourceType: data.sourceType
        };
        
        userNotifications.push(notification);
      });
      
      // Set notifications from the initial query
      setNotifications(userNotifications);
      
      // Check if there are any unseen notifications
      const hasUnseen = userNotifications.some(notification => !notification.seen);
      setHasNewNotifications(hasUnseen);
      
      // Only set up the real-time listener if it hasn't been set up already
      if (!realtimeListenerSetup.current) {
        realtimeListenerSetup.current = true;
        
        // Set up real-time listener AFTER populating the seen IDs
        // Remove the delivered filter to see all notifications
        const realtimeQuery = query(
          collection(db, 'user_notifications'),
          where('userId', '==', userId),
          // Don't filter by delivered status to see all notifications
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        onSnapshot(realtimeQuery, (snapshot) => {
          // Debug: log the activity
          console.log('Received real-time update for notifications');
          console.log(`Found ${snapshot.size} notifications in snapshot`);
          
          // Track if we found any new notifications
          let hasNewUnseen = false;
          
          // Process notifications in the snapshot
          setNotifications(currentNotifications => {
            // Create a new array to hold updated notifications
            const updatedNotifications = [...currentNotifications];
            
            // Process each notification in the snapshot
            snapshot.forEach(doc => {
              const data = doc.data();
              console.log(`Real-time update for notification: ${doc.id}`, data);
              
              // If the notification isn't marked as delivered, mark it now
              if (!data.delivered) {
                console.log(`Marking notification ${doc.id} as delivered in real-time update`);
                updateDoc(doc.ref, { delivered: true }).catch((error: Error) => {
                  console.error(`Error marking notification ${doc.id} as delivered:`, error);
                });
              }
              
              // Skip if we've already processed this notification
              if (processedNotificationIds.current.has(doc.id)) {
                return;
              }
              
              // Add to processed notifications set
              processedNotificationIds.current.add(doc.id);
              
              const notification: Notification = {
                id: doc.id,
                title: data.title,
                message: data.message,
                type: data.type,
                seen: data.seen,
                delivered: true, // Always treat as delivered in the UI
                createdAt: data.createdAt?.toDate(),
                sourceId: data.sourceId,
                sourceType: data.sourceType
              };
              
              // If it has a sourceId, check if we've seen it before
              if (data.sourceId) {
                // If we've already seen this sourceId, skip it unless it's a different notification ID
                if (seenQuestionIds.current.has(data.sourceId)) {
                  return;
                }
                
                // Add to seen questions set
                seenQuestionIds.current.add(data.sourceId);
              }
              
              // Add to the beginning of the array
              updatedNotifications.unshift(notification);
              
              // If it's not marked as seen, we have new unseen notifications
              if (!data.seen) {
                hasNewUnseen = true;
              }
            });
            
            return updatedNotifications;
          });
          
          // If we found any unseen notifications, update the state
          if (hasNewUnseen) {
            setHasNewNotifications(true);
          }
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  // Load notifications from localStorage as a fallback
  const loadLocalStorageNotifications = (userId: string) => {
    try {
      const notifications: Notification[] = [];
      const keyPrefix = `notification_${userId}_`;
      
      // Iterate through localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(keyPrefix)) {
          try {
            const notificationStr = localStorage.getItem(key);
            if (notificationStr) {
              const storedNotification = JSON.parse(notificationStr);
              const notification: Notification = {
                id: key,
                title: storedNotification.title,
                message: storedNotification.message,
                type: storedNotification.type || 'info',
                seen: storedNotification.seen || false,
                createdAt: storedNotification.createdAt ? new Date(storedNotification.createdAt) : new Date(),
                sourceId: storedNotification.sourceId,
                sourceType: storedNotification.sourceType
              };
              
              notifications.push(notification);
              
              // If it has a sourceId, add to our set of seen question IDs
              if (notification.sourceId) {
                seenQuestionIds.current.add(notification.sourceId);
              }
              
              // Add to processed notifications set
              processedNotificationIds.current.add(notification.id);
            }
          } catch (error) {
            console.error('Error parsing localStorage notification:', key, error);
          }
        }
      }
      
      if (notifications.length > 0) {
        console.log('Loaded notifications from localStorage:', notifications.length);
        setNotifications(notifications);
        
        // Check if there are any unseen notifications
        const hasUnseen = notifications.some(notification => !notification.seen);
        setHasNewNotifications(hasUnseen);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  };

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    try {
      const granted = await notificationService.requestPermission();
      setIsPermissionGranted(granted);
      setIsPushEnabled(notificationService.isPushEnabled());
      
      // If permission is granted, subscribe the user to relevant topics
      if (granted && currentUser) {
        await notificationService.subscribeUser(currentUser.id, [
          NotificationTopic.NEW_QUESTIONS,
          // Only subscribe to new questions
        ]);
        
        // Show a confirmation notification
        showNotification({
          title: 'Notifications Enabled',
          message: 'You will now receive notifications for new questions',
          type: 'success',
          duration: 5000
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      showNotification({
        title: 'Notification Error',
        message: 'Failed to enable notifications',
        type: 'error',
        duration: 5000
      });
      return false;
    }
  };

  // Show a notification locally (in the dropdown)
  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    
    // Check for duplicate notification with the same sourceId
    if (notification.sourceId) {
      // Add to seen questions set to prevent duplicates
      if (seenQuestionIds.current.has(notification.sourceId)) {
        console.log(`Skipping duplicate notification for sourceId: ${notification.sourceId}`);
        return id;
      }
      
      // Add to seen questions set
      seenQuestionIds.current.add(notification.sourceId);
    }
    
    setNotifications((prev) => [
      newNotification,
      ...prev.filter(n => {
        // Filter out duplicate notifications for the same source
        if (notification.sourceId && n.sourceId === notification.sourceId) {
          return false;
        }
        return true;
      })
    ]);
    
    return id;
  };

  // Dismiss a notification
  const dismissNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    // Mark as seen in Firestore if applicable
    if (notification && notification.sourceId) {
      // Use Firebase Function to mark notification as seen
      const markNotificationSeen = httpsCallable(functions, 'markNotificationSeen');
      
      if (notification.id.includes('/') || notification.id.length > 10) {
        // This is likely a Firestore document ID
        markNotificationSeen({ notificationId: id })
          .then(() => console.log('Notification marked as seen:', id))
          .catch(err => console.error('Error marking notification as seen:', err));
      } else if (notification.sourceId) {
        // Mark by sourceId
        markNotificationSeen({ sourceId: notification.sourceId })
          .then(() => console.log('Notification marked as seen by sourceId:', notification.sourceId))
          .catch(err => console.error('Error marking notification as seen by sourceId:', err));
        
        // Add to seen questions set
        seenQuestionIds.current.add(notification.sourceId);
      }
      
      // If this is a localStorage notification (ID starts with "notification_")
      if (id.startsWith('notification_')) {
        try {
          // Update the item in localStorage to mark it as seen
          const storedItem = localStorage.getItem(id);
          if (storedItem) {
            const parsedItem = JSON.parse(storedItem);
            parsedItem.seen = true;
            localStorage.setItem(id, JSON.stringify(parsedItem));
            console.log('Marked localStorage notification as seen:', id);
          }
        } catch (error) {
          console.error('Error updating localStorage notification:', error);
        }
      }
    }
    
    setNotifications((prev) => 
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Clear the new notifications flag
  const clearNewNotificationsFlag = () => {
    setHasNewNotifications(false);
    
    // Mark all notifications as seen
    notifications.forEach(notification => {
      if (!notification.seen && notification.sourceId) {
        // Use Firebase Function to mark notification as seen
        const markSeen = httpsCallable(functions, 'markNotificationSeen');
        
        if (notification.id.includes('/') || notification.id.length > 10) {
          // This is likely a Firestore document ID
          markSeen({ notificationId: notification.id })
            .catch(err => console.error('Error marking notification as seen:', err));
        } else if (notification.sourceId) {
          // Mark by sourceId
          markSeen({ sourceId: notification.sourceId })
            .catch(err => console.error('Error marking notification as seen by sourceId:', err));
          
          // Add to seen questions set
          seenQuestionIds.current.add(notification.sourceId);
        }
        
        // If this is a localStorage notification
        if (notification.id.startsWith('notification_')) {
          try {
            // Update the item in localStorage to mark it as seen
            const storedItem = localStorage.getItem(notification.id);
            if (storedItem) {
              const parsedItem = JSON.parse(storedItem);
              parsedItem.seen = true;
              localStorage.setItem(notification.id, JSON.stringify(parsedItem));
            }
          } catch (error) {
            console.error('Error updating localStorage notification:', error);
          }
        }
      }
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        dismissNotification,
        isSupported,
        isPermissionGranted,
        isPushEnabled,
        requestPermission,
        hasNewNotifications,
        clearNewNotificationsFlag
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationManager; 