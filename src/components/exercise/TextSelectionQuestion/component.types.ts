import type {
  ExerciseAnswer,
  QuestionValidationResult,
  TextSelectionQuestionData,
} from '../../../types/exercise';

export interface TextSelectionQuestionProps {
  question: TextSelectionQuestionData;
  answer: ExerciseAnswer;
  onChange: (answer: ExerciseAnswer) => void;
  className?: string;
  disabled?: boolean;
  validation?: QuestionValidationResult;
}
