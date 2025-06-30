
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  yearOfStudy?: number;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  maxAttempts: number;
  passingScore?: number;
  isPublished: boolean;
  createdById: string;
  createdAt: string;
  questions: Question[];
}

export interface Question {
  id: string;
  examId: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'LONG_ANSWER' | 'CODE' | 'TRUE_FALSE';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
}

export interface StudentExam {
  id: string;
  studentId: string;
  examId: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'EXPIRED';
  attemptNumber: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  studentExamId: string;
  questionId: string;
  studentId: string;
  answer: string;
  isCorrect?: boolean;
  score?: number;
  aiScore?: number;
  feedback?: string;
  submittedAt: string;
}

export interface ProctoringEvent {
  id: string;
  studentExamId: string;
  studentId: string;
  type: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'SUSPICIOUS_MOVEMENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  timestamp: string;
  metadata?: any;
}
