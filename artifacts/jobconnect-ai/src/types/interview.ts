export interface InterviewQuestion {
  question: string;
  topic: string;
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  betterAnswer: string;
  strengths: string[];
  weaknesses: string[];
}

export interface InterviewSession {
  id: string;
  questions: InterviewQuestion[];
}