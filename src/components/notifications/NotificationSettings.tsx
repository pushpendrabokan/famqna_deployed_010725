import React, { useState, useEffect } from 'react';
import { notificationService, NotificationTopic } from '../../services/NotificationService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { useNotificationManager } from './NotificationManager';

interface NotificationSettingsProps {
  userId: string;
  preferences?: {
    topics?: NotificationTopic[];
  };
  onSave?: (preferences: { topics: NotificationTopic[] }) => Promise<void>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  userId,
  preferences = {},
  onSave,
}) => {
  const [permissionState, setPermissionState] = useState<'default' | 'granted' | 'denied'>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<NotificationTopic[]>(preferences.topics || []);
  const { showNotification } = useNotificationManager();

  // Check initial permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission as 'default' | 'granted' | 'denied');
    }
  }, []);

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    try {
      const granted = await notificationService.requestPermission();
      setPermissionState(granted ? 'granted' : 'denied');
      
      if (granted) {
        // Set default topics
        const topics = [
              NotificationTopic.NEW_QUESTIONS,
              NotificationTopic.PAYMENT_SETTLEMENTS,
              NotificationTopic.QUESTION_ANSWERS
            ];
            
        setSelectedTopics(topics);
        
        // Subscribe user
        await notificationService.subscribeUser(userId, topics);
        
        // Save preferences
        if (onSave) {
          await onSave({ topics });
        }
        
        // Use NotificationManager to show notification
        showNotification({
          title: "Notifications Enabled",
          message: "You'll now receive notifications for new questions and payments",
          type: "success",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Toggle a topic selection
  const toggleTopic = (topic: NotificationTopic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  // Save notification preferences
  const savePreferences = async () => {
    setIsSubscribing(true);
    try {
      if (permissionState === 'granted') {
        await notificationService.subscribeUser(userId, selectedTopics);
        
        if (onSave) {
          await onSave({ topics: selectedTopics });
        }
        
        // Use NotificationManager to show notification
        showNotification({
          title: "Preferences Updated",
          message: "Your notification preferences have been updated",
          type: "success",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Card className="bg-deep-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Push Notification Settings</h3>
          <p className="text-light-300 text-sm">Get notified about new questions and payments</p>
        </div>
      </div>

      {/* Permission Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Notification Status:</span>
          
          {permissionState === 'granted' ? (
            <span className="flex items-center text-accent-green">
              <CheckCircle className="w-4 h-4 mr-1" />
              Enabled
            </span>
          ) : permissionState === 'denied' ? (
            <span className="flex items-center text-red-500">
              <XCircle className="w-4 h-4 mr-1" />
              Blocked
            </span>
          ) : (
            <span className="text-light-300">Not enabled</span>
          )}
        </div>

        {permissionState === 'denied' && (
          <p className="text-light-300 text-sm mt-2 bg-deep-200 p-3 rounded-lg border border-gray-700">
            You've blocked notifications in your browser. Please update your browser settings to enable notifications:
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Look for "Notifications" permission</li>
              <li>Change it from "Block" to "Allow"</li>
            </ol>
          </p>
        )}

        {permissionState === 'default' && !notificationService.isPushEnabled() && (
          <Button
            variant="primary"
            onClick={handleEnableNotifications}
            className="mt-3"
            isLoading={isSubscribing}
          >
            Enable Push Notifications
          </Button>
        )}
      </div>

      {/* Notification Categories */}
      {permissionState === 'granted' && (
        <>
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3">Notification Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="new-questions" className="flex items-center cursor-pointer">
                  <span className="text-light-200">New Questions</span>
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="new-questions"
                    className="sr-only peer"
                    checked={selectedTopics.includes(NotificationTopic.NEW_QUESTIONS)}
                    onChange={() => toggleTopic(NotificationTopic.NEW_QUESTIONS)}
                  />
                  <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="payment-settlements" className="flex items-center cursor-pointer">
                  <span className="text-light-200">Payment Settlements</span>
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="payment-settlements"
                    className="sr-only peer"
                    checked={selectedTopics.includes(NotificationTopic.PAYMENT_SETTLEMENTS)}
                    onChange={() => toggleTopic(NotificationTopic.PAYMENT_SETTLEMENTS)}
                  />
                  <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="question-answers" className="flex items-center cursor-pointer">
                  <span className="text-light-200">Question Answers</span>
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="question-answers"
                    className="sr-only peer"
                    checked={selectedTopics.includes(NotificationTopic.QUESTION_ANSWERS)}
                    onChange={() => toggleTopic(NotificationTopic.QUESTION_ANSWERS)}
                  />
                  <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="platform-updates" className="flex items-center cursor-pointer">
                  <span className="text-light-200">Platform Updates</span>
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="platform-updates"
                    className="sr-only peer"
                    checked={selectedTopics.includes(NotificationTopic.PLATFORM_UPDATES)}
                    onChange={() => toggleTopic(NotificationTopic.PLATFORM_UPDATES)}
                  />
                  <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={savePreferences}
            isLoading={isSubscribing}
          >
            Save Preferences
          </Button>
        </>
      )}
    </Card>
  );
};

export default NotificationSettings;