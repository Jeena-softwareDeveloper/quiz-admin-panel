export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: string;
  educationLevel: string;
  examInterests: string;
  skillRating: number;
  walletBalance: number;
  createdAt: string;
  _count?: {
    participations: number;
  };
}

export interface QuestionItem {
  id: string;
  category: string;
  subCategory?: string;
  difficulty: string;
  targetEducation: string;
  questionText: string;
  questionTextTamil?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  timesUsed?: number;
  lastUsedAt?: string;
  createdAt: string;
}

export interface QuizRoomItem {
  id: string;
  title: string;
  category: string;
  targetEducation: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  participantCount: number;
  status: 'SCHEDULED' | 'WAITING' | 'COUNTDOWN' | 'LIVE' | 'WAITING_RESULTS' | 'FINISHED' | 'CANCELLED';
  totalQuestions: number;
  scheduledStartTime?: string;
  joinWindowMinutes?: number;
  botCount?: number;
  winnerStrategy?: 'HUMAN_PRIORITY' | 'BOT_PRIORITY' | 'MERIT';
  targetWinnerType?: 'HUMAN' | 'BOT';
  resultsReleased?: boolean;
  resultsReleasedAt?: string;
  designatedWinnerId?: string;
  createdAt: string;
}

export interface LedgerItem {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
  user?: {
    name: string;
    phone: string;
  };
}

export interface BannerItem {
  id: string;
  title: string;
  titleTamil?: string;
  subtitle?: string;
  subtitleTamil?: string;
  imageUrl: string;
  actionType: string;
  actionTarget?: string;
  actionText: string;
  actionTextTamil?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalRooms: number;
  activeRooms: number;
  totalQuestions: number;
  totalWalletPool: number;
  totalTransactions: number;
  categoryBreakdown: { category: string; _count: { id: number } }[];
}
