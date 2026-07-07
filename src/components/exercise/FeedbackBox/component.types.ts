export interface FeedbackBoxReasoningFeedback {
  isCorrect: boolean;
  message: string;
  acceptedAnswers?: string[];
  solution?: string;
}

export interface FeedbackBoxProps {
  isCorrect: boolean;
  message: string;
  correctTitle: string;
  incorrectTitle: string;
  solutionTitle: string;
  solution?: string;
  className?: string;
  explanation?: string;
  reasoningAcceptedAnswersTitle?: string;
  reasoningFeedback?: FeedbackBoxReasoningFeedback;
  reasoningSolutionTitle?: string;
  reasoningTitle?: string;
}
