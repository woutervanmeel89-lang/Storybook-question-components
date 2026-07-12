import type {
  ExerciseAnswer,
  ExerciseQuestion,
  FieldValidationResult,
  QuestionValidationResult,
  ReasoningConfig,
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
): FieldValidationResult {
  if (!reasoning) {
    return { isCorrect: true };
  }

  const trimmedAnswer = answer.trim();

  if (!trimmedAnswer) {
    return {
      isCorrect: false,
    };
  }

  if (reasoning.validationMode === 'custom') {
    const isCorrect = reasoning.customValidator?.(trimmedAnswer) ?? true;
    return {
      isCorrect,
    };
  }

  const isCorrect = matchesAcceptedAnswer(trimmedAnswer, reasoning.acceptedAnswers, {
    caseSensitive: reasoning.caseSensitive,
    mode: reasoning.validationMode === 'contains' ? 'contains' : 'exact',
  });

  return {
    isCorrect,
  };
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
  };
}

export function validateQuestion(
  question: ExerciseQuestion,
  answer: ExerciseAnswer,
): QuestionValidationResult {
  const fields: Record<string, FieldValidationResult> = {};
  const blankReasonings: Record<string, FieldValidationResult> = {};

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

  if (question.type === 'text-selection') {
    const selectedIds = new Set(answer.selectedOptionIds ?? []);
    const correctIds = new Set(question.correctOptionIds);

    question.options.forEach((option) => {
      fields[option.id] = {
        isCorrect: selectedIds.has(option.id) === correctIds.has(option.id),
      };
    });
  }

  const fieldsCorrect = Object.values(fields).every((field) => field.isCorrect);
  const reasoning = validateReasoning(question.reasoning, answer.reasoning);
  const blankReasoningsCorrect = Object.values(blankReasonings).every(
    (blankReasoning) => blankReasoning.isCorrect,
  );

  return {
    isCorrect: fieldsCorrect && reasoning.isCorrect && blankReasoningsCorrect,
    reasoning,
    blankReasonings,
    fields,
  };
}

export function isAnswerReady(question: ExerciseQuestion, answer: ExerciseAnswer) {
  const hasReasoning = !question.reasoning || Boolean(answer.reasoning?.trim());

  if (!hasReasoning) {
    return false;
  }

  if (question.type === 'short-answer') {
    return Boolean(answer.shortAnswer?.trim());
  }


  if (question.type === 'text-selection') {
    return Boolean(answer.selectedOptionIds?.length);
  }

  return question.blanks.every((blank) => {
    const hasBlankAnswer = Boolean(answer.blanks?.[blank.id]?.trim());
    const hasBlankReasoning =
      !blank.reasoning || Boolean(answer.blankReasonings?.[blank.id]?.trim());

    return hasBlankAnswer && hasBlankReasoning;
  });
}
