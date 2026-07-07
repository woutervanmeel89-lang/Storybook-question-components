import type {
  ExerciseAnswer,
  QuestionValidationResult,
  ShortAnswerQuestionData,
} from '../../../types/exercise';

export interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionData;
  answer: ExerciseAnswer;
  onChange: (answer: ExerciseAnswer) => void;
  solutionTitle: string;
  className?: string;
  disabled?: boolean;
  validation?: QuestionValidationResult;
}
