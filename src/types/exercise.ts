export type QuestionType = 'fill-in-the-blank' | 'short-answer';

export type ReasoningValidationMode = 'contains' | 'exact' | 'custom';

export type ReasoningConfig = {
  enabled: boolean;
  required?: boolean;
  prompt: string;
  acceptedAnswers?: string[];
  validationMode?: ReasoningValidationMode;
  caseSensitive?: boolean;
  customValidator?: (answer: string) => boolean;
  feedback?: {
    correct: string;
    incorrect: string;
    solution?: string;
  };
};

export type QuestionFeedback = {
  correct: string;
  incorrect: string;
  solution: string;
  explanation?: string;
};

export type BaseQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  feedback: QuestionFeedback;
  reasoning?: ReasoningConfig;
};

export type FillInBlank = {
  id: string;
  label?: string;
  acceptedAnswers: string[];
  caseSensitive?: boolean;
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

export type ExerciseQuestion =
  | FillInTheBlankQuestionData
  | ShortAnswerQuestionData;

export type ExerciseAnswer = {
  shortAnswer?: string;
  blanks?: Record<string, string>;
  reasoning?: string;
};

export type FieldValidationResult = {
  isCorrect: boolean;
  message?: string;
};

export type ReasoningValidationResult = FieldValidationResult & {
  enabled: boolean;
};

export type QuestionValidationResult = {
  isCorrect: boolean;
  mainCorrect: boolean;
  reasoning: ReasoningValidationResult;
  fields: Record<string, FieldValidationResult>;
};
