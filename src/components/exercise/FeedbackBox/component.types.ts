export interface FeedbackBoxReasoningFeedback {
  isCorrect: boolean;
  message: string;
  acceptedAnswers?: string[];
  solution?: string;
}

export interface FeedbackBoxProps {
  isCorrect: boolean;
  message: string;
  solution?: string;
  className?: string;
  correctTitle?: string;
  explanation?: string;
  incorrectTitle?: string;
  solutionTitle?: string;
  reasoningFeedback?: FeedbackBoxReasoningFeedback;
}
