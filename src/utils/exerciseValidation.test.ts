import { describe, expect, it } from 'vitest';
import type { ExerciseQuestion } from '../types/exercise';
import {
  isAnswerReady,
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
        prompt: 'Explique pourquoi.',
        acceptedAnswers: ['à + le'],
        validationMode: 'contains',
      },
      'C’est la contraction de à + le.',
    );

    expect(result.isCorrect).toBe(true);
  });

  it('validates reasoning for individual blanks', () => {
    const question: ExerciseQuestion = {
      id: 'blank-reasoning',
      type: 'fill-in-the-blank',
      prompt: 'Ils etaient {hidden}.',
      blanks: [
        {
          id: 'hidden',
          acceptedAnswers: ['cachés'],
          reasoning: {
            prompt: 'Raisonnement',
            acceptedAnswers: ['accord avec le sujet'],
            validationMode: 'contains',
          },
        },
      ],
    };

    expect(
      validateQuestion(question, {
        blanks: { hidden: 'cachés' },
        blankReasonings: { hidden: 'accord avec le sujet etre' },
      }).isCorrect,
    ).toBe(true);

    expect(
      validateQuestion(question, {
        blanks: { hidden: 'cachés' },
        blankReasonings: { hidden: 'wrong' },
      }).isCorrect,
    ).toBe(false);
  });

  it('requires mandatory reasoning for individual blanks before submit', () => {
    const question: ExerciseQuestion = {
      id: 'blank-reasoning-ready',
      type: 'fill-in-the-blank',
      prompt: 'Sans etre {seen}.',
      blanks: [
        {
          id: 'seen',
          acceptedAnswers: ['vus'],
          reasoning: {
            prompt: 'Raisonnement',
            acceptedAnswers: ['infinitif avec le sujet ils'],
          },
        },
      ],
    };

    expect(isAnswerReady(question, { blanks: { seen: 'vus' } })).toBe(false);
    expect(
      isAnswerReady(question, {
        blanks: { seen: 'vus' },
        blankReasonings: { seen: 'infinitif avec le sujet ils' },
      }),
    ).toBe(true);
  });
});

