import { Creator, Question, Notification } from '../types';

export const mockCreators: Creator[] = [
  {
    id: 'creator1',
    username: 'priyasharma-x8k2m',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Tech influencer and software engineer. I talk about coding, career growth, and life in tech.',
    expertise: ['Coding', 'Career Development', 'Tech Industry'],
    publicPrice: 800,
    privatePrice: 1600,
    followers: 15800,
    answeredQuestions: 342,
    responseRate: 98
  },
  {
    id: 'creator2',
    username: 'arjunkapoor-p9j4n',
    name: 'Arjun Kapoor',
    email: 'arjun@example.com',
    photoURL: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Fitness coach specializing in nutrition and strength training. I help you become the best version of yourself.',
    expertise: ['Fitness', 'Nutrition', 'Wellness'],
    publicPrice: 600,
    privatePrice: 1200,
    followers: 24500,
    answeredQuestions: 523,
    responseRate: 95
  },
  {
    id: 'creator3',
    username: 'meerapatel-m7h3k',
    name: 'Meera Patel',
    email: 'meera@example.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Financial advisor and investor. I help millennials build wealth and achieve financial freedom.',
    expertise: ['Finance', 'Investing', 'Personal Finance'],
    publicPrice: 1000,
    privatePrice: 2000,
    followers: 10200,
    answeredQuestions: 189,
    responseRate: 92
  },
  {
    id: 'creator4',
    username: 'rahulverma-q2w5p',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    photoURL: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Travel vlogger exploring hidden gems across India. I share budget travel tips and cultural experiences.',
    expertise: ['Travel', 'Photography', 'Cultural Experiences'],
    publicPrice: 700,
    privatePrice: 1400,
    followers: 31200,
    answeredQuestions: 456,
    responseRate: 97
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    creatorId: 'creator1',
    userId: 'user1',
    userName: 'Amit Kumar',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    content: 'What programming language would you recommend for someone starting their coding journey in 2025?',
    isPrivate: false,
    price: 800,
    status: 'answered',
    createdAt: new Date('2025-01-10T12:30:00'),
    answeredAt: new Date('2025-01-11T15:45:00'),
    answer: 'Great question! For beginners in 2025, I recommend starting with Python. It has a gentle learning curve, readable syntax, and is versatile for web development, data science, and automation. Once comfortable, branch into JavaScript for web development or continue deepening Python knowledge for data science and AI.'
  },
  {
    id: 'q2',
    creatorId: 'creator1',
    userId: 'user2',
    userName: 'Nisha Gupta',
    userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    content: 'How do you maintain work-life balance as a tech professional? I find myself working extra hours constantly.',
    isPrivate: true,
    price: 1600,
    status: 'answered',
    createdAt: new Date('2025-01-15T09:15:00'),
    answeredAt: new Date('2025-01-16T11:20:00'),
    answer: "I understand this challenge well. First, set clear boundaries—establish work hours and stick to them. Use time-blocking to boost productivity during work hours. Communicate boundaries to colleagues and managers. Find fulfilling non-tech hobbies and prioritize physical activity. Remember, consistent rest makes you more effective long-term. If you'd like a personalized plan, feel free to ask a follow-up!"
  },
  {
    id: 'q3',
    creatorId: 'creator2',
    userId: 'user3',
    userName: 'Vikram Singh',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    content: "I'm a vegetarian trying to build muscle. What protein sources would you recommend that aren't supplements?",
    isPrivate: false,
    price: 600,
    status: 'answered',
    createdAt: new Date('2025-01-18T14:45:00'),
    answeredAt: new Date('2025-01-19T10:30:00'),
    answer: "Great question about vegetarian protein sources! Focus on: Greek yogurt (20g protein/cup), paneer (18g/100g), lentils (18g/cup cooked), chickpeas (15g/cup), tofu (10g/100g), and quinoa (8g/cup). Combine these throughout the day, aiming for 1.6-2g of protein per kg of bodyweight. Mix different sources for complete amino acid profiles. With consistent intake and proper strength training, you'll definitely see muscle growth!"
  },
  {
    id: 'q4',
    creatorId: 'creator3',
    userId: 'user4',
    userName: 'Priyanka Das',
    userPhoto: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    content: 'With the current market conditions, should I focus on debt funds or equity for long-term investment?',
    isPrivate: false,
    price: 1000,
    status: 'pending',
    createdAt: new Date('2025-01-20T16:30:00')
  },
  {
    id: 'q5',
    creatorId: 'creator4',
    userId: 'user5',
    userName: 'Sanjay Patel',
    userPhoto: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    content: 'What are some lesser-known destinations in Northeast India that you would recommend?',
    isPrivate: true,
    price: 1400,
    status: 'pending',
    createdAt: new Date('2025-01-22T11:15:00')
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'creator1',
    type: 'new_question',
    message: 'You received a new public question worth ₹800',
    read: false,
    createdAt: new Date('2025-01-20T16:30:00'),
    relatedId: 'q4'
  },
  {
    id: 'n2',
    userId: 'creator4',
    type: 'new_question',
    message: 'You received a new private question worth ₹1,400',
    read: false,
    createdAt: new Date('2025-01-22T11:15:00'),
    relatedId: 'q5'
  },
  {
    id: 'n3',
    userId: 'user3',
    type: 'question_answered',
    message: 'Your question to Arjun Kapoor has been answered',
    read: true,
    createdAt: new Date('2025-01-19T10:30:00'),
    relatedId: 'q3'
  },
  {
    id: 'n4',
    userId: 'user1',
    type: 'payment_success',
    message: 'Payment of ₹800 for your question was successful',
    read: true,
    createdAt: new Date('2025-01-10T12:30:00'),
    relatedId: 'q1'
  }
];

// Function to get mock data for the currently authenticated user
export const getCurrentUserNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getCreatorById = (id: string): Creator | undefined => {
  return mockCreators.find(creator => creator.id === id);
};

export const getCreatorByUsername = (username: string): Creator | undefined => {
  return mockCreators.find(creator => creator.username === username);
};

export const getCreatorQuestions = (creatorId: string): Question[] => {
  return mockQuestions.filter(question => question.creatorId === creatorId);
};

export const getUserQuestions = (userId: string): Question[] => {
  return mockQuestions.filter(question => question.userId === userId);
};