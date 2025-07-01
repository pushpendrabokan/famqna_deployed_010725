import { useState, useEffect, useCallback } from 'react';
import { 
  notificationService, 
  NotificationTopic, 
  NotificationType 
} from '../services/NotificationService';
import { useAuth } from './useAuth';
import { useNotificationManager } from '../components/notifications/NotificationManager';

interface UseNotificationsReturn {
  isSupported: boolean;
  isPermissionGranted: boolean;
  isPushEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  subscribeToTopics: (topics: NotificationTopic[]) => Promise<boolean>;
  showLocalNotification: (title: string, body: string, data?: any) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { currentUser } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const { showNotification } = useNotificationManager();

  // Check initial state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported(notificationService.isSupported());
      setIsPermissionGranted(notificationService.isPermissionGranted());
      setIsPushEnabled(notificationService.isPushEnabled());
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    try {
      const granted = await notificationService.requestPermission();
      setIsPermissionGranted(granted);
      setIsPushEnabled(notificationService.isPushEnabled());
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  // Subscribe to notification topics
  const subscribeToTopics = useCallback(async (topics: NotificationTopic[]): Promise<boolean> => {
    if (!currentUser || !isPermissionGranted) return false;
    
    try {
      const success = await notificationService.subscribeUser(currentUser.id, topics);
      setIsPushEnabled(success);
      return success;
    } catch (error) {
      console.error('Error subscribing to topics:', error);
      return false;
    }
  }, [currentUser, isPermissionGranted]);

  // Show a local notification - use NotificationManager instead of direct notification service
  const showLocalNotification = useCallback((title: string, body: string, data?: any) => {
    if (!isPermissionGranted) return;
    
    // Use the NotificationManager to show notifications in the navbar dropdown
    showNotification({
      title,
      message: body,
      type: 'info',
      duration: 5000
    });
    
    // Don't call notificationService.sendLocalNotification - this creates floating notifications
  }, [isPermissionGranted, showNotification]);

  return {
    isSupported,
    isPermissionGranted,
    isPushEnabled,
    requestPermission,
    subscribeToTopics,
    showLocalNotification
  };
};