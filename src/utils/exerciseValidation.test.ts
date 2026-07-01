import { describe, expect, it } from 'vitest';
import type { ExerciseQuestion } from '../types/exercise';
import {
  matchesAcceptedAnswer,
  validateQuestion,
  validateReasoning,
} from './exerciseValidation';

describe('exerciseValidation', () => {
  it('trims and compares answers case-insensitively by default', () => {
    expect(matchesAcceptedAnswer(' Je Vais ', ['je vais'])).toBe(true);
  });

  it('validates short-answer questions', () => {
    const question: ExerciseQuestion = {
      id: 'short-1',
      type: 'short-answer',
      prompt: "Quelle est la traduction de 'ik ga' ?",
      acceptedAnswers: ['je vais'],
      feedback: {
        correct: 'Correct.',
        incorrect: 'Essaie encore.',
        solution: 'Je vais',
      },
    };

    expect(validateQuestion(question, { shortAnswer: 'je vais' }).isCorrect).toBe(
      true,
    );
    expect(validateQuestion(question, { shortAnswer: 'je suis' }).isCorrect).toBe(
      false,
    );
  });

  it('validates every blank in fill-in-the-blank questions', () => {
    const question: ExerciseQuestion = {
      id: 'blank-1',
      type: 'fill-in-the-blank',
      prompt: 'Complète la phrase.',
      blanks: [
        { id: 'first', acceptedAnswers: ['au'] },
        { id: 'second', acceptedAnswers: ['marché'] },
      ],
      feedback: {
        correct: 'Correct.',
        incorrect: 'Essaie encore.',
        solution: 'Je vais au marché.',
      },
    };

    expect(
      validateQuestion(question, {
        blanks: { first: 'au', second: 'marché' },
      }).isCorrect,
    ).toBe(true);
    expect(
      validateQuestion(question, {
        blanks: { first: 'à', second: 'marché' },
      }).isCorrect,
    ).toBe(false);
  });

  it('validates required reasoning separately', () => {
    const result = validateReasoning(
      {
        enabled: true,
        required: true,
        prompt: 'Explique pourquoi.',
        acceptedAnswers: ['à + le'],
      },
      'contraction de à + le',
    );

    expect(result.isCorrect).toBe(false);
  });

  it('supports contains matching for reasoning', () => {
    const result = validateReasoning(
      {
        enabled: true,
        required: true,
        prompt: 'Explique pourquoi.',
        acceptedAnswers: ['à + le'],
        validationMode: 'contains',
      },
      'C’est la contraction de à + le.',
    );

    expect(result.isCorrect).toBe(true);
  });
});
