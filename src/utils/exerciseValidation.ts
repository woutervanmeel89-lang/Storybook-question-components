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
  const blankReasonings: Record<string, ReasoningValidationResult> = {};

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

      blankReasonings[blank.id] = validateReasoning(
        blank.reasoning,
        answer.blankReasonings?.[blank.id],
      );
    });
  }

  const mainCorrect = Object.values(fields).every((field) => field.isCorrect);
  const reasoning = validateReasoning(question.reasoning, answer.reasoning);
  const blankReasoningsCorrect = Object.values(blankReasonings).every(
    (blankReasoning) => blankReasoning.isCorrect,
  );

  return {
    isCorrect: mainCorrect && reasoning.isCorrect && blankReasoningsCorrect,
    mainCorrect,
    reasoning,
    blankReasonings,
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

  return question.blanks.every((blank) => {
    const hasBlankAnswer = Boolean(answer.blanks?.[blank.id]?.trim());
    const hasBlankReasoning =
      !blank.reasoning?.enabled ||
      !blank.reasoning.required ||
      Boolean(answer.blankReasonings?.[blank.id]?.trim());

    return hasBlankAnswer && hasBlankReasoning;
  });
}
