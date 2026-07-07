import type { ExerciseQuestion } from '../../../types/exercise';

export interface QuestionPagerButtonLabels {
  check: string;
  close: string;
  next: string;
}

export interface QuestionPagerReasoningLabels {
  acceptedAnswersTitle?: string;
  correctFallback: string;
  feedbackTitle?: string;
  incorrectFallback: string;
  solutionTitle?: string;
}

export interface QuestionPagerProps {
  questions: ExerciseQuestion[];
  buttonLabels: QuestionPagerButtonLabels;
  completionMessage: string;
  completionTitle: string;
  emptyMessage: string;
  emptyTitle: string;
  feedbackCorrectTitle: string;
  feedbackIncorrectTitle: string;
  feedbackSolutionTitle: string;
  repeatRoundLabel: string;
  className?: string;
  onClose?: () => void;
  reasoningLabels?: QuestionPagerReasoningLabels;
}
