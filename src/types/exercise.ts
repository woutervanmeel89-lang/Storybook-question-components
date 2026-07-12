export type QuestionType = 'fill-in-the-blank' | 'short-answer' | 'text-selection';

export type ReasoningValidationMode = 'contains' | 'exact' | 'custom';

export type ReasoningConfig = {
  prompt: string;
  acceptedAnswers: string[];
  validationMode?: ReasoningValidationMode;
  caseSensitive?: boolean;
  customValidator?: (answer: string) => boolean;
};

export type BaseQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  reasoning?: ReasoningConfig;
};

export type FillInBlank = {
  id: string;
  label?: string;
  acceptedAnswers: string[];
  caseSensitive?: boolean;
  reasoning?: ReasoningConfig;
};

export type FillInTheBlankQuestionData = BaseQuestion & {
  type: 'fill-in-the-blank';
  blanks: FillInBlank[];
};

export type ShortAnswerQuestionData = BaseQuestion & {
  type: 'short-answer';
  acceptedAnswers: string[];
  caseSensitive?: boolean;
};

export type TextSelectionUnit = 'word' | 'sentence';

export type TextSelectionOption = {
  id: string;
  text: string;
};

export type TextSelectionQuestionData = BaseQuestion & {
  type: 'text-selection';
  selectionUnit: TextSelectionUnit;
  options: TextSelectionOption[];
  correctOptionIds: string[];
};

export type ExerciseQuestion =
  | FillInTheBlankQuestionData
  | ShortAnswerQuestionData
  | TextSelectionQuestionData;

export type ExerciseAnswer = {
  shortAnswer?: string;
  blanks?: Record<string, string>;
  blankReasonings?: Record<string, string>;
  reasoning?: string;
  selectedOptionIds?: string[];
};

export type FieldValidationResult = {
  isCorrect: boolean;
};

export type QuestionValidationResult = {
  isCorrect: boolean;
  reasoning: FieldValidationResult;
  blankReasonings: Record<string, FieldValidationResult>;
  fields: Record<string, FieldValidationResult>;
};
