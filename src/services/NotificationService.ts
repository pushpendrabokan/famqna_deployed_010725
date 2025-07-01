import { 
  initializeApp, 
  getApps, 
  getApp 
} from 'firebase/app';
import { 
  getMessaging, 
  getToken, 
  onMessage, 
  Messaging 
} from 'firebase/messaging';
import { app } from '../lib/firebase';
import { updateUser } from '../lib/firestore';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Define the extended notification options type
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

// Notification topics
export enum NotificationTopic {
  NEW_QUESTIONS = 'new-questions',
  PLATFORM_UPDATES = 'platform-updates',
}

// Notification types
export enum NotificationType {
  NEW_QUESTION = 'new-question',
  SYSTEM_UPDATE = 'system-update',
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    type: NotificationType;
    questionId?: string;
    paymentId?: string;
    [key: string]: any;
  };
}

interface SMSLog {
  to: string;
  message: string;
  type: 'question_created' | 'other';
  status: 'sent' | 'failed';
  error?: string;
  sentAt: Date;
}

export class NotificationService {
  private isClientSide: boolean = typeof window !== 'undefined';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  // Make messaging public so it can be accessed
  public messaging: Messaging | null = null;
  private token: string | null = null;
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  private initialized = false;
  private permissionGranted = false;
  private onNotificationListener: ((payload: NotificationPayload) => void) | null = null;
  private mockMode = false;
  private initializationAttempts = 0;
  private maxInitAttempts = 3;
  private sns: SNSClient;
  private db = getFirestore();

  constructor() {
    // Only use mock mode in development environment
    this.mockMode = process.env.NODE_ENV === 'development' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
    console.log('Notification service using mock mode:', this.mockMode);

    this.sns = new SNSClient({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      }
    });
  }

  /**
   * Initialize notifications for a creator who wants to receive notifications
   */
  public async initializeForCreator(): Promise<boolean> {
    if (!this.isClientSide || !('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (this.initialized) {
      return true;
    }

    try {
      // Register service worker and set up messaging only for creators
      console.log('Initializing notifications for creator...');
      return await this.initialize();
    } catch (error) {
      console.error('Error initializing notifications for creator:', error);
      return false;
    }
  }

  /**
   * Retry getting the FCM token with exponential backoff
   */
  private async retryGetToken(): Promise<void> {
    if (this.initializationAttempts < this.maxInitAttempts) {
      this.initializationAttempts++;
      console.log(`Retry attempt ${this.initializationAttempts} to get FCM token...`);
      
      try {
        const token = await this.getDeviceToken();
        if (token) {
          console.log(`Successfully retrieved FCM token on retry ${this.initializationAttempts}`);
          this.token = token;
          this.initializationAttempts = 0;
        } else {
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, this.initializationAttempts), 10000);
          console.log(`FCM token retrieval failed, retrying in ${delay}ms...`);
          setTimeout(() => this.retryGetToken(), delay);
        }
      } catch (error) {
        console.error(`Error getting token on retry ${this.initializationAttempts}:`, error);
        // Retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, this.initializationAttempts), 10000);
        setTimeout(() => this.retryGetToken(), delay);
      }
    } else {
      console.error(`Failed to get FCM token after ${this.maxInitAttempts} attempts`);
    }
  }

  /**
   * Initialize the notification service
   */
  private async initialize() {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }

      // Set up message listener for service worker responses
      navigator.serviceWorker.addEventListener('message', (event) => {
        const data = event.data;
        console.log('Received message from service worker:', data);
        
        if (data && data.type === 'SW_INITIALIZED') {
          console.log('Service worker successfully initialized Firebase');
          // Try to get the FCM token now that the service worker is ready
          if (this.permissionGranted && !this.mockMode) {
            this.getDeviceToken()
              .then(token => {
                console.log('Got FCM token after SW initialization:', token ? token.substring(0, 10) + '...' : 'failed');
                if (token) {
                  // Token retrieved successfully
                  this.token = token;
                } else {
                  // Retry after a short delay
                  setTimeout(() => this.retryGetToken(), 2000);
                }
              })
              .catch(error => {
                console.error('Error getting token after SW initialization:', error);
                // Retry after a short delay
                setTimeout(() => this.retryGetToken(), 2000);
              });
          }
        } else if (data && data.type === 'SW_ERROR') {
          console.error('Service worker reported an error:', data.error);
        } else if (data && data.type === 'PONG') {
          console.log('Service worker is alive and responded to ping', data);
        }
      });

      // Ensure service worker is registered FIRST
      try {
        console.log('Attempting to register service worker...');
        // Try to get existing service worker registration first
        const existingRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        
        if (existingRegistration) {
          this.serviceWorkerRegistration = existingRegistration;
          console.log('Using existing service worker registration with scope:', existingRegistration.scope);
        } else {
          // Register a new service worker
          this.serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          console.log('Service Worker registered with scope:', this.serviceWorkerRegistration.scope);
        }
      } catch (swError) {
        console.error('Error registering service worker:', swError);
        // Continue anyway to try with the existing service worker
      }

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('Service worker is ready');

      // Initialize Firebase messaging if not in mock mode
      if (!this.mockMode) {
        try {
          console.log('Initializing Firebase messaging...');
          this.messaging = getMessaging(app);
          
          // Pass Firebase configuration to service worker
          if (this.serviceWorkerRegistration?.active) {
            console.log('Sending Firebase config to service worker...');
            const config = {
              apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
              authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
              projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
              storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
              appId: import.meta.env.VITE_FIREBASE_APP_ID,
              vapidKey: this.vapidKey
            };
            
            this.serviceWorkerRegistration.active.postMessage({
              type: 'FIREBASE_CONFIG',
              config
            });
            console.log('Firebase config sent to service worker');
            
            // Set up notification listener for foreground
            this.onMessage((payload) => {
              console.log('Received foreground message:', payload);
              this.handleForegroundNotification(payload);
            });
            
            // Try to get the token immediately if permission is already granted
            if (Notification.permission === 'granted') {
              this.permissionGranted = true;
              // Delay token retrieval to give service worker time to initialize
              setTimeout(async () => {
                try {
                  const token = await this.getDeviceToken();
                  console.log('Got FCM token:', token ? token.substring(0, 10) + '...' : 'failed');
                  if (!token) {
                    // Retry with backoff if token retrieval failed
                    setTimeout(() => this.retryGetToken(), 2000);
                  }
                } catch (error) {
                  console.error('Error getting initial token:', error);
                  setTimeout(() => this.retryGetToken(), 2000);
                }
              }, 2000);
            }
          } else {
            console.error('Service worker not active - cannot send config');
          }
        } catch (firebaseError) {
          console.error('Error initializing Firebase messaging:', firebaseError);
          // Fall back to mock mode if Firebase fails
          this.mockMode = true;
        }
      }
      
      // Set permission state
      this.permissionGranted = Notification.permission === 'granted';
      console.log('Notification permission state:', Notification.permission);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    try {
      console.log('Requesting notification permission...');
      
      // Check permission state - may already be granted
      if (Notification.permission === 'granted') {
        console.log('Notification permission already granted');
        this.permissionGranted = true;
        
        // Try to get the FCM token now that permission is granted
        if (!this.mockMode && this.messaging) {
          const token = await this.getDeviceToken();
          console.log('Got FCM token after permission check:', token ? 'success' : 'failed');
        }
        
        return true;
      }
      
      // If denied, can't request again in most browsers
      if (Notification.permission === 'denied') {
        console.warn('Notification permission was denied');
        this.permissionGranted = false;
        return false;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
      
      if (permission === 'granted') {
        this.permissionGranted = true;
        
        // Re-register service worker if needed
        await this.ensureServiceWorker();
        
        // Show a test notification to confirm permissions work
        await this.showTestNotification();
        
        // Get token for Firebase Cloud Messaging if not in mock mode
        if (!this.mockMode && this.messaging) {
          try {
            const token = await this.getDeviceToken();
            console.log('Got FCM token after permission grant:', token ? 'success' : 'failed');
          } catch (error) {
            console.error('Error getting device token after permission grant:', error);
          }
        }
        
        return true;
      } else {
        this.permissionGranted = false;
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Send a test notification to confirm permissions work
   */
  private async showTestNotification(): Promise<void> {
    try {
      const testNotification: NotificationPayload = {
        title: 'Notifications Enabled',
        body: 'You will now receive notifications from FamQnA',
        data: {
          type: NotificationType.SYSTEM_UPDATE,
          url: '/dashboard'
        }
      };
      
      // Use direct browser notification API for the test
      if ('serviceWorker' in navigator) {
        const registration = await this.ensureServiceWorker();
        if (registration) {
          const options: ExtendedNotificationOptions = {
            body: testNotification.body,
            icon: '/notification-icon.png',
            tag: 'test-notification',
            renotify: true
          };
          await registration.showNotification(testNotification.title, options);
          console.log('Test notification sent successfully');
        }
      }
    } catch (error) {
      console.error('Error showing test notification:', error);
    }
  }

  /**
   * Get the device token for push notifications
   */
  public async getDeviceToken(): Promise<string | null> {
    if (!this.isClientSide) {
      console.log('Not client-side, cannot get device token');
      return null;
    }
    
    if (!this.initialized) {
      console.error('Cannot get device token - notification service not initialized');
      return null;
    }
    
    if (this.mockMode) {
      console.log('Mock mode enabled, using mock token');
      this.token = 'mock-token-' + Math.random().toString(36).substring(2, 15);
      return this.token;
    }
    
    if (!this.permissionGranted) {
      console.log('Notification permission not granted, requesting it first');
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        console.error('Permission not granted, cannot get device token');
        return null;
      }
    }
    
    try {
      // Make sure we have a service worker registration
      const registration = await this.ensureServiceWorker();
      
      if (!registration) {
        console.error('No service worker registration available');
        return null;
      }
      
      if (!this.messaging) {
        console.error('Firebase messaging not initialized');
        // Don't try to initialize here - it can cause loops
        return null;
      }
      
      if (!this.vapidKey) {
        console.error('No VAPID key available');
        return null;
      }
      
      console.log('Requesting FCM token with VAPID key:', this.vapidKey ? 'provided' : 'not provided');
      
      // Get token from Firebase
      const currentToken = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
        serviceWorkerRegistration: registration
      });
      
      if (!currentToken) {
        console.error('Failed to get FCM token from Firebase');
        return null;
      }
      
      console.log('FCM Token obtained successfully:', currentToken.substring(0, 10) + '...');
      this.token = currentToken;
      
      return currentToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Subscribe a user to notification topics
   */
  public async subscribeUser(userId: string, topics: NotificationTopic[]): Promise<boolean> {
    if (!userId) {
      console.error('User ID is required for notification subscription');
      return false;
    }

    try {
      console.log(`Subscribing user ${userId} to topics:`, topics);
      
      // If in mock mode, just simulate success
      if (this.mockMode) {
        console.log('Mock mode: Simulating subscription success');
        // Update user record with subscription flag
        await updateUser(userId, { 
          notificationPreferences: {
            topics: [NotificationTopic.NEW_QUESTIONS],
            updatedAt: new Date()
          } 
        });
        return true;
      }
      
      // Get token if we don't have one
      if (!this.token) {
        const token = await this.getDeviceToken();
        if (!token) {
          console.error('Failed to get device token for subscription');
          return false;
        }
      }
      
      // First, directly save the FCM token to the user document in Firestore
      // This ensures the token is saved even if the Netlify function fails
      console.log(`Directly saving FCM token to user ${userId} document in Firestore`);
      try {
        await updateUser(userId, { 
          fcmToken: this.token || undefined,
          notificationPreferences: {
            topics: [NotificationTopic.NEW_QUESTIONS],
            updatedAt: new Date()
          } 
        });
        console.log('FCM token saved successfully to Firestore');
      } catch (error) {
        console.error('Error saving FCM token to Firestore:', error);
        // Continue anyway to try the subscription function
      }
      
      // Try to use the Netlify function, but don't rely on it for success
      try {
        const response = await fetch('/.netlify/functions/notification-subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            token: this.token,
            topics: [NotificationTopic.NEW_QUESTIONS], // Only subscribe to new questions
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('Successfully subscribed to notification topics via Netlify function:', data);
        } else {
          console.warn('Netlify function subscription failed, but token was saved to Firestore:', data.error);
        }
      } catch (error) {
        console.warn('Error calling Netlify subscription function, but token was saved to Firestore:', error);
      }
      
      // Return success since we've at least saved the token to Firestore
      return true;
    } catch (error) {
      console.error('Error in subscribeUser:', error);
      return false;
    }
  }

  /**
   * Send a local notification
   */
  public sendLocalNotification(payload: NotificationPayload): void {
    try {
      console.log('Sending local notification:', payload);
      
      if (!this.permissionGranted) {
        console.warn('Notification permission not granted');
        return;
      }

      // First, trigger the callback for in-app notifications
      // This will be handled by the NotificationManager
      if (this.onNotificationListener) {
        this.onNotificationListener(payload);
      }
      
      // Only show browser notification if we're not in mock mode
      if (!this.mockMode && 'serviceWorker' in navigator && this.permissionGranted) {
        // Ensure we have an active service worker
        this.ensureServiceWorker().then(registration => {
          if (registration) {
            // Ping the service worker to make sure it's alive
            this.pingServiceWorker();
            
            const options: ExtendedNotificationOptions = {
              body: payload.body,
              icon: payload.icon || '/notification-icon.png',
              badge: payload.badge || '/notification-badge.png',
              tag: payload.tag || `notification-${Date.now()}`, // Ensure unique tag to avoid replacing
              data: payload.data,
              vibrate: [100, 50, 100],
              renotify: true, // Force the notification to be displayed even if the same tag is used
              requireInteraction: true // Keep notification visible until user interacts with it
            };
            
            console.log('Showing browser notification with options:', options);
            
            // Use setTimeout to avoid potential race conditions
            setTimeout(() => {
              registration.showNotification(payload.title, options)
                .then(() => console.log('Browser notification shown successfully'))
                .catch(err => {
                  console.error('Error showing notification:', err);
                  
                  // Fallback to direct Notification API if service worker fails
                  if ('Notification' in window) {
                    new Notification(payload.title, options);
                  }
                });
            }, 100);
          } else {
            console.warn('No service worker registration available, trying direct notification');
            // Fallback to direct notification if no service worker
            if ('Notification' in window) {
              const directOptions: ExtendedNotificationOptions = {
                body: payload.body,
                icon: payload.icon || '/notification-icon.png',
                tag: payload.tag || `notification-${Date.now()}`,
                renotify: true
              };
              new Notification(payload.title, directOptions);
            }
          }
        }).catch(err => {
          console.error('Error ensuring service worker:', err);
        });
      }
    } catch (error) {
      console.error('Error in sendLocalNotification:', error);
      // Prevent errors from bubbling up and breaking the application
    }
  }

  /**
   * Ensure we have a valid service worker registration
   */
  private async ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
      if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.active) {
        console.log('Reusing existing service worker registration');
        return this.serviceWorkerRegistration;
      }
      
      if ('serviceWorker' in navigator) {
        try {
          // Try to get existing registration first
          console.log('Looking for existing service worker registration...');
          const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (registration && registration.active) {
            this.serviceWorkerRegistration = registration;
            console.log('Found existing service worker registration');
            return registration;
          }
          
          // If no existing registration, try to register new one
          console.log('Registering new service worker...');
          this.serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          console.log('New service worker registered with scope:', this.serviceWorkerRegistration.scope);
          
          // Wait for the service worker to be ready
          if (this.serviceWorkerRegistration.installing || this.serviceWorkerRegistration.waiting) {
            console.log('Waiting for service worker to become active...');
            await new Promise<void>((resolve) => {
              const worker = this.serviceWorkerRegistration!.installing || this.serviceWorkerRegistration!.waiting;
              if (worker) {
                worker.addEventListener('statechange', (event) => {
                  if (worker.state === 'activated') {
                    console.log('Service worker activated!');
                    resolve();
                  }
                });
              } else {
                resolve();
              }
            });
          }
          
          // Send Firebase config to the service worker
          if (this.serviceWorkerRegistration.active && !this.mockMode) {
            console.log('Sending Firebase config to new service worker...');
            const config = {
              apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
              authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
              projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
              storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
              appId: import.meta.env.VITE_FIREBASE_APP_ID,
              vapidKey: this.vapidKey
            };
            
            this.serviceWorkerRegistration.active.postMessage({
              type: 'FIREBASE_CONFIG',
              config
            });
          }
          
          return this.serviceWorkerRegistration;
        } catch (err) {
          console.error('Error getting service worker registration:', err);
          return null;
        }
      }
      return null;
    } catch (err) {
      console.error('Error in ensureServiceWorker:', err);
      return null;
    }
  }

  /**
   * Handle foreground notifications
   */
  private handleForegroundNotification(payload: any): void {
    try {
      // Create notification payload
      const notification: NotificationPayload = {
        title: payload.notification.title,
        body: payload.notification.body,
        data: payload.data
      };

      // Call listener if set - this is enough, no need to call sendLocalNotification
      // which would create duplicate notifications in a loop
      if (this.onNotificationListener) {
        this.onNotificationListener(notification);
      }
      
      // We don't need to call sendLocalNotification here, as it would trigger the listener again
      // this.sendLocalNotification(notification);
    } catch (error) {
      console.error('Error in handleForegroundNotification:', error);
      // Prevent errors from bubbling up and breaking the application
    }
  }

  /**
   * Set notification received listener
   */
  public onNotificationReceived(callback: (payload: NotificationPayload) => void): void {
    this.onNotificationListener = callback;
  }

  /**
   * Check if notifications are supported
   */
  public isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Check if notification permission is granted
   */
  public isPermissionGranted(): boolean {
    return this.permissionGranted;
  }

  /**
   * Check if push notifications are enabled
   */
  public isPushEnabled(): boolean {
    return this.initialized && this.permissionGranted && !!this.token;
  }

  /**
   * Ping the service worker to check if it's alive
   */
  private pingServiceWorker(): void {
    try {
      if (this.serviceWorkerRegistration?.active) {
        console.log('Pinging service worker...');
        this.serviceWorkerRegistration.active.postMessage({
          type: 'PING',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error pinging service worker:', error);
    }
  }

  // Method to handle Firebase Cloud Messaging foreground messages
  public onMessage(callback: (payload: any) => void): void {
    if (!this.messaging) {
      console.error('Firebase messaging not initialized');
      return;
    }
    
    // Using non-null assertion since we already checked it's not null
    onMessage(this.messaging!, (payload) => {
      console.log('FCM message received in service:', payload);
      callback(payload);
    });
  }

  /**
   * Log SMS sending activity to Firestore
   */
  private async logSMSActivity(userId: string, smsLog: SMSLog): Promise<void> {
    try {
      const logRef = doc(this.db, 'users', userId, 'smsLogs', new Date().toISOString());
      await setDoc(logRef, {
        ...smsLog,
        sentAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging SMS activity:', error);
    }
  }

  /**
   * Send an SMS notification for a new question
   */
  async sendQuestionCreatedSMS(
    userId: string, 
    phoneNumber: string, 
    questionId: string,
    creatorName: string
  ): Promise<boolean> {
    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Create a short tracking link
    const trackingLink = `https://playful-zabaione-0a3324.netlify.app/q/${questionId}`;
    
    // Create a concise message (SMS should be short)
    const message = `FamQnA: Your question to ${creatorName} has been submitted. Track it here: ${trackingLink}`;
    
    try {
      console.log('Sending question created SMS to:', formattedPhone);
      
      const params = {
        Message: message,
        PhoneNumber: formattedPhone,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional'
          },
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'FamQnA'
          }
        }
      };
      
      console.log('Sending SNS message with params:', JSON.stringify(params, null, 2));
      const command = new PublishCommand(params);
      const response = await this.sns.send(command);
      console.log('SNS response:', JSON.stringify(response, null, 2));
      
      // Log the SMS activity
      await this.logSMSActivity(userId, {
        to: formattedPhone,
        message,
        type: 'question_created',
        status: 'sent',
        sentAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error sending question created SMS:', error);
      
      // Log the failed attempt
      if (userId) {
        await this.logSMSActivity(userId, {
          to: formattedPhone,
          message,
          type: 'question_created',
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          sentAt: new Date()
        });
      }
      
      return false;
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();