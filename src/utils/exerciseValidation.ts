import type {
  ExerciseAnswer,
  ExerciseQuestion,
  FieldValidationResult,
  QuestionValidationResult,
  ReasoningConfig,
  ReasoningValidationResult,
} from '../types/exercise';

export function normalizeAnswer(answer: string, caseSensitive = false) {
  const trimmed = answer.trim();
  return caseSensitive ? trimmed : trimmed.toLocaleLowerCase();
}

export function matchesAcceptedAnswer(
  answer: string,
  acceptedAnswers: string[],
  options: {
    caseSensitive?: boolean;
    mode?: 'exact' | 'contains';
  } = {},
) {
  const normalizedAnswer = normalizeAnswer(answer, options.caseSensitive);

  return acceptedAnswers.some((acceptedAnswer) => {
    const normalizedAccepted = normalizeAnswer(
      acceptedAnswer,
      options.caseSensitive,
    );

    if (options.mode === 'contains') {
      return normalizedAnswer.includes(normalizedAccepted);
    }

    return normalizedAnswer === normalizedAccepted;
  });
}

export function validateReasoning(
  reasoning: ReasoningConfig | undefined,
  answer = '',
): ReasoningValidationResult {
  if (!reasoning?.enabled) {
    return { enabled: false, isCorrect: true };
  }

  const trimmedAnswer = answer.trim();
  const hasAcceptedAnswers = Boolean(reasoning.acceptedAnswers?.length);

  if (reasoning.required && !trimmedAnswer) {
    return {
      enabled: true,
      isCorrect: false,
      message: 'Vul ook je uitleg in.',
    };
  }

  if (!hasAcceptedAnswers && !reasoning.required && !trimmedAnswer) {
    return { enabled: true, isCorrect: true };
  }

  if (reasoning.validationMode === 'custom') {
    const isCorrect = reasoning.customValidator?.(trimmedAnswer) ?? true;
    return {
      enabled: true,
      isCorrect,
      message: isCorrect ? undefined : 'De uitleg is nog niet juist.',
    };
  }

  if (hasAcceptedAnswers) {
    const isCorrect = matchesAcceptedAnswer(
      trimmedAnswer,
      reasoning.acceptedAnswers ?? [],
      {
        caseSensitive: reasoning.caseSensitive,
        mode: reasoning.validationMode === 'contains' ? 'contains' : 'exact',
      },
    );

    return {
      enabled: true,
      isCorrect,
      message: isCorrect ? undefined : 'De uitleg is nog niet juist.',
    };
  }

  return { enabled: true, isCorrect: true };
}

function validateField(
  answer: string | undefined,
  acceptedAnswers: string[],
  caseSensitive?: boolean,
): FieldValidationResult {
  const isCorrect = matchesAcceptedAnswer(answer ?? '', acceptedAnswers, {
    caseSensitive,
  });

  return {
    isCorrect,
    message: isCorrect ? undefined : 'Dit antwoord is nog niet juist.',
  };
}

export function validateQuestion(
  question: ExerciseQuestion,
  answer: ExerciseAnswer,
): QuestionValidationResult {
  const fields: Record<string, FieldValidationResult> = {};

  if (question.type === 'short-answer') {
    fields.shortAnswer = validateField(
      answer.shortAnswer,
      question.acceptedAnswers,
      question.caseSensitive,
    );
  }

  if (question.type === 'fill-in-the-blank') {
    question.blanks.forEach((blank) => {
      fields[blank.id] = validateField(
        answer.blanks?.[blank.id],
        blank.acceptedAnswers,
        blank.caseSensitive,
      );
    });
  }

  const mainCorrect = Object.values(fields).every((field) => field.isCorrect);
  const reasoning = validateReasoning(question.reasoning, answer.reasoning);

  return {
    isCorrect: mainCorrect && reasoning.isCorrect,
    mainCorrect,
    reasoning,
    fields,
  };
}

export function isAnswerReady(question: ExerciseQuestion, answer: ExerciseAnswer) {
  const hasReasoning =
    !question.reasoning?.enabled ||
    !question.reasoning.required ||
    Boolean(answer.reasoning?.trim());

  if (!hasReasoning) {
    return false;
  }

  if (question.type === 'short-answer') {
    return Boolean(answer.shortAnswer?.trim());
  }

  return question.blanks.every((blank) => Boolean(answer.blanks?.[blank.id]?.trim()));
}
