import type { ExerciseQuestion } from '../../../types/exercise';

export interface QuestionPagerProps {
  questions: ExerciseQuestion[];
  className?: string;
  onClose?: () => void;
  completionTitle?: string;
  completionMessage?: string;
  feedbackCorrectTitle?: string;
  feedbackIncorrectTitle?: string;
  feedbackSolutionTitle?: string;
}
