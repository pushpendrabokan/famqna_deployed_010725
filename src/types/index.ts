export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  username?: string;
  bio?: string;
  phone?: string;
  settings?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    marketingUpdates?: boolean;
  };
  notificationPreferences?: {
    token?: string;
    topics?: string[];
    updatedAt?: Date;
  };
}

export interface Creator extends User {
  username: string;
  expertise: string[];
  publicPrice: number;
  privatePrice: number;
  followers: number;
  answeredQuestions: number;
  responseRate: number;
  fcmToken?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  dateOfBirth?: string;
  phone?: string;
  phoneVerified?: boolean;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    name: string;
    fundAccountId?: string;
    status?: 'pending' | 'verified' | 'rejected';
  };
  kycDetails?: {
    pan: string;
    gst?: string;
    status: 'pending' | 'verified' | 'rejected';
  };
}

export interface Question {
  id: string;
  creatorId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  isPrivate: boolean;
  price: number;
  status: 'pending' | 'answered' | 'refunded';
  paymentId?: string;
  orderId?: string;
  transferId?: string;
  createdAt: Date;
  answeredAt?: Date;
  answer?: string;
  guestPhone?: string;
  guestEmail?: string;
  trackingId?: string;
}

export interface Transfer {
  id: string;
  creatorId: string;
  amount: number;
  platformFee: number;
  questionId?: string;
  paymentId: string;
  orderId: string;
  transferId: string;
  status: string;
  date: Date;
}

export type NotificationType = 'new_question' | 'question_answered' | 'payment_success' | 'refund_processed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string; // Can be questionId, etc.
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | void>;
  signOut: () => Promise<void>;
}

// Notification related types
export interface NotificationPreferences {
  topics: string[];
  token?: string;
  updatedAt?: Date;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    type: string;
    questionId?: string;
    paymentId?: string;
    [key: string]: any;
  };
}