import { db } from './firebase';
import { 
  collection, doc, getDoc, getDocs, query, where, 
  addDoc, updateDoc, deleteDoc, serverTimestamp, 
  DocumentData, setDoc, orderBy, limit, startAfter
} from 'firebase/firestore';
import { Creator, Question } from '../types';


const USERS = 'users';
const QUESTIONS = 'questions';

// Helper function to ensure document exists
const ensureDocExists = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

const formatFirestoreData = (doc: DocumentData) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    answeredAt: data.answeredAt?.toDate(),
    publicPrice: Number(data.publicPrice || 0),
    privatePrice: Number(data.privatePrice || 0)
  };
};

export const getCreatorByUsername = async (username: string): Promise<Creator | null> => {
  const q = query(collection(db, USERS), where('username', '==', username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const data = formatFirestoreData(querySnapshot.docs[0]);
  return {
    ...data,
    bankDetails: data.bankDetails || null,
    kycDetails: data.kycDetails || null,
    publicPrice: Number(data.publicPrice || 800),
    privatePrice: Number(data.privatePrice || 1600)
  } as Creator;
};

export const getUserById = async (userId: string): Promise<Creator | null> => {
  try {
    const docRef = doc(db, USERS, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      bankDetails: data.bankDetails || null,
      kycDetails: data.kycDetails || null,
      publicPrice: Number(data.publicPrice || 800),
      privatePrice: Number(data.privatePrice || 1600)
    } as Creator;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const updateUser = async (id: string, data: Partial<Creator>): Promise<void> => {
  const docRef = doc(db, USERS, id);
  await updateDoc(docRef, data);
};

// Creator onboarding functions
export const updateCreatorBankDetails = async (
  userId: string,
  bankDetails: Creator['bankDetails']
): Promise<void> => {
  const docRef = doc(db, USERS, userId);
  await updateDoc(docRef, { bankDetails });
};

export const updateCreatorKYCDetails = async (
  userId: string,
  kycDetails: Creator['kycDetails']
): Promise<void> => {
  const docRef = doc(db, USERS, userId);
  await updateDoc(docRef, { kycDetails });
};

// Question functions
export const getCreatorQuestions = async (
  creatorId: string,
  pageSize?: number,
  lastDoc?: Date,
  filters?: {
    status?: 'answered' | 'pending';
    isPrivate?: boolean;
    requirePayment?: boolean;
  }
): Promise<Question[]> => {
  // Start with base query conditions
  let conditions = [where('creatorId', '==', creatorId)];
  
  // Add filter conditions if provided
  if (filters?.status) {
    conditions.push(where('status', '==', filters.status));
  }
  
  if (filters?.isPrivate !== undefined) {
    conditions.push(where('isPrivate', '==', filters.isPrivate));
  }
  
  if (filters?.requirePayment) {
    conditions.push(where('paymentId', '!=', null));
  }

  // Create the query with all conditions
  let q = query(
    collection(db, QUESTIONS),
    ...conditions,
    orderBy('createdAt', 'desc')
  );

  if (pageSize) {
    q = query(q, limit(pageSize));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    answeredAt: doc.data().answeredAt?.toDate()
  })) as Question[];
};

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, QUESTIONS), {
    ...question,
    createdAt: new Date(),
    status: 'pending',
    // Add default values to ensure document structure
    answeredAt: null,
    answer: null,
    paymentId: null,
    orderId: null,
    transferId: null
  });
  
  // Set the document with ID to ensure it exists
  await setDoc(docRef, {
    id: docRef.id,
    ...question,
    createdAt: new Date(),
    status: 'pending',
    answeredAt: null,
    answer: null,
    paymentId: null,
    orderId: null,
    transferId: null
  });
  
  return docRef.id;
};

export const getQuestionById = async (id: string): Promise<Question | null> => {
  const docRef = doc(db, QUESTIONS, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate(),
    answeredAt: docSnap.data().answeredAt?.toDate()
  } as Question;
};

export const getQuestionByTrackingId = async (trackingId: string): Promise<Question | null> => {
  const q = query(collection(db, QUESTIONS), where('trackingId', '==', trackingId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    answeredAt: doc.data().answeredAt?.toDate()
  } as Question;
};

export const updateQuestion = async (id: string, data: Partial<Question>): Promise<void> => {
  // Get the document reference
  const docRef = doc(db, QUESTIONS, id);
  
  // Ensure the document exists before updating
  const exists = await ensureDocExists(QUESTIONS, id);
  if (!exists) {
    throw new Error(`Question with ID ${id} does not exist`);
  }
  
  await updateDoc(docRef, data);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, QUESTIONS, id));
};

// Transfer related functions - keeping for future PayU integration
export const getCreatorTransfers = async (creatorId: string) => {
  const q = query(
    collection(db, 'transfers'),
    where('creatorId', '==', creatorId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate()
  }));
};

// Withdrawal functions - keeping for future payment integration
export const getWithdrawalHistory = async (userId: string) => {
  const q = query(
    collection(db, 'withdrawals'),
    where('userId', '==', userId),
    orderBy('requestedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    requestedAt: doc.data().requestedAt.toDate(),
    processedAt: doc.data().processedAt?.toDate()
  }));
};

export const createWithdrawal = async (userId: string, amount: number) => {
  return await addDoc(collection(db, 'withdrawals'), {
    userId,
    amount,
    status: 'pending',
    requestedAt: new Date()
  });
};

// Record a payment transfer - will be updated for PayU integration
export const recordTransfer = async (transferData: {
  creatorId: string;
  amount: number;
  questionId?: string;
  paymentId: string;
  orderId: string;
  transferId: string;
  status: string;
}) => {
  const platformFee = transferData.amount * 0.2; // 20% platform fee
  const creatorAmount = transferData.amount - platformFee;
  
  return await addDoc(collection(db, 'transfers'), {
    ...transferData,
    amount: creatorAmount,
    platformFee,
    date: new Date()
  });
};

export async function isUsernameTaken(username: string): Promise<boolean> {
  const q = query(collection(db, USERS), where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}