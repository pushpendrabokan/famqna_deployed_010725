import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Settings, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NotificationTopic } from '../../services/NotificationService';
import Button from '../ui/Button';
import { useNotificationManager } from './NotificationManager';

interface NotificationCenterProps {
  onSettingsClick?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onSettingsClick }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isSupported,
    isPermissionGranted,
    requestPermission,
    hasNewNotifications,
    clearNewNotificationsFlag,
    showNotification,
    notifications,
    dismissNotification
  } = useNotificationManager();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen) {
      clearNewNotificationsFlag();
    }
    setIsOpen(!isOpen);
  };

  // For testing - send a test notification
  const sendTestNotification = () => {
    if (isPermissionGranted) {
      showNotification({
        title: "Test Notification",
        message: "This is a test notification",
        type: "info",
        duration: 5000
      });
    } else {
      alert("You need to enable notifications first");
    }
  };

  // Get the right icon for each notification type
  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-accent-blue" />;
      case 'success':
        return <Check className="h-4 w-4 text-accent-green" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-accent-yellow" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-accent-blue" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        className="relative p-2 rounded-full text-light-100 hover:text-primary hover:bg-deep-300/50 transition-colors"
        onClick={toggleMenu}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {hasNewNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-deep-100 rounded-lg shadow-lg border border-gray-700 z-50 origin-top-right animate-fadeIn">
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Notifications</h3>
            <div className="flex gap-2">
              {onSettingsClick && (
                <button 
                  onClick={onSettingsClick}
                  className="text-light-300 hover:text-primary p-1 rounded-full"
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-light-300 hover:text-primary p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Permission Request (if not granted) */}
          {!isPermissionGranted && isSupported && (
            <div className="p-4 border-b border-gray-700 bg-deep-200/50">
              <p className="text-light-300 text-sm mb-3">
                Enable push notifications to get updates about new questions, payments, and more.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={requestPermission}
                fullWidth
              >
                Enable Notifications
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 hover:bg-deep-200/50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-light-100">{notification.title}</h4>
                        <p className="text-xs text-light-300 mt-0.5">{notification.message}</p>
                      </div>
                      <button 
                        onClick={() => dismissNotification(notification.id)}
                        className="ml-2 text-light-400 hover:text-light-200 p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-light-300 text-sm">
                No notifications yet
              </div>
            )}
            
            {/* Hidden in production, visible in development for testing */}
            {process.env.NODE_ENV === 'development' && isPermissionGranted && (
              <div className="p-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={sendTestNotification}
                  fullWidth
                >
                  Send Test Notification
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;