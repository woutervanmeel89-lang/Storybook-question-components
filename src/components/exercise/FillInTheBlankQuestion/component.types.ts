import type {
  ExerciseAnswer,
  FillInTheBlankQuestionData,
  QuestionValidationResult,
} from '../../../types/exercise';

export interface FillInTheBlankQuestionProps {
  question: FillInTheBlankQuestionData;
  answer: ExerciseAnswer;
  onChange: (answer: ExerciseAnswer) => void;
  className?: string;
  disabled?: boolean;
  validation?: QuestionValidationResult;
}
