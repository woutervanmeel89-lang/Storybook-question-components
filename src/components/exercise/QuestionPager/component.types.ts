import type { ExerciseQuestion } from '../../../types/exercise';

export interface QuestionPagerButtonLabels {
  check: string;
  close: string;
  next: string;
}

export interface QuestionPagerProps {
  questions: ExerciseQuestion[];
  buttonLabels: QuestionPagerButtonLabels;
  completionMessage: string;
  completionTitle: string;
  emptyMessage: string;
  emptyTitle: string;
  repeatRoundLabel: string;
  className?: string;
  onClose?: () => void;
}
