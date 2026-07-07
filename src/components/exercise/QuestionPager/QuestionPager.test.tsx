import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ExerciseQuestion } from '../../../types/exercise';
import { QuestionPager } from './QuestionPager';

const questions: ExerciseQuestion[] = [
  {
    id: 'first',
    type: 'short-answer',
    prompt: "Quelle est la traduction de 'ik ga' en français ?",
    acceptedAnswers: ['je vais'],
    feedback: {
      correct: 'Très bien.',
      incorrect: 'Regarde encore le verbe aller.',
      solution: 'Je vais',
    },
  },
  {
    id: 'second',
    type: 'fill-in-the-blank',
    prompt: 'Complète la phrase : Je vais ___ marché.',
    blanks: [{ id: 'prep', label: 'Préposition', acceptedAnswers: ['au'] }],
    feedback: {
      correct: 'Correct.',
      incorrect: 'Regarde la contraction.',
      solution: 'Je vais au marché.',
    },
  },
];

const labels = {
  buttonLabels: {
    check: 'Verifiëren',
    close: 'Afsluiten',
    next: 'Verdergaan',
  },
  completionMessage: 'Alle vragen zijn juist beantwoord.',
  completionTitle: 'Klaar',
  emptyMessage: 'Er zijn geen oefeningen om te tonen.',
  emptyTitle: 'Geen vragen',
  feedbackCorrectTitle: 'Juist',
  feedbackIncorrectTitle: 'Nog niet juist',
  feedbackSolutionTitle: 'Oplossing',
  reasoningLabels: {
    acceptedAnswersTitle: 'Geaccepteerde antwoorden',
    correctFallback: 'De uitleg is juist.',
    feedbackTitle: 'Extra uitleg',
    incorrectFallback: 'De uitleg is nog niet juist.',
    solutionTitle: 'Voorbeeld',
  },
  repeatRoundLabel: 'Herhaalronde',
};

describe('QuestionPager', () => {
  it('shows the first question', () => {
    render(<QuestionPager {...labels} questions={questions} />);

    expect(
      screen.getByText("Quelle est la traduction de 'ik ga' en français ?"),
    ).toBeInTheDocument();
  });

  it('shows feedback after submit', async () => {
    const user = userEvent.setup();
    render(<QuestionPager {...labels} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText('Très bien.')).toBeInTheDocument();
  });

  it('shows accepted answers after an incorrect short answer', async () => {
    const user = userEvent.setup();
    render(
      <QuestionPager
        {...labels}
        questions={[
          {
            ...questions[0],
            acceptedAnswers: ['je vais', "j'y vais"],
          },
        ]}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText("je vais / j'y vais")).toBeInTheDocument();
  });

  it('shows the accepted answer for incorrect blanks', async () => {
    const user = userEvent.setup();
    render(
      <QuestionPager
        {...labels}
        questions={[
          {
            id: 'blank-question',
            type: 'fill-in-the-blank',
            prompt: 'Nous ___ ___ boulangerie.',
            blanks: [
              { id: 'verb', label: 'Verbe', acceptedAnswers: ['allons'] },
              { id: 'prep', label: 'Preposition', acceptedAnswers: ['a la'] },
            ],
            feedback: {
              correct: 'Correct.',
              incorrect: 'Regarde encore.',
              solution: 'Nous allons a la boulangerie.',
            },
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText('Verbe'), 'allons');
    await user.type(screen.getByLabelText('Preposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText('Oplossing:')).toBeInTheDocument();
    expect(screen.getByText('a la')).toBeInTheDocument();
    expect(screen.queryByText('Verbe: allons')).not.toBeInTheDocument();
  });

  it('shows accepted reasoning answers prominently after incorrect reasoning', async () => {
    const user = userEvent.setup();
    render(
      <QuestionPager
        {...labels}
        questions={[
          {
            id: 'reasoning-question',
            type: 'fill-in-the-blank',
            prompt: 'Je parle {prep} professeur.',
            blanks: [
              { id: 'prep', label: 'Preposition', acceptedAnswers: ['au'] },
            ],
            reasoning: {
              enabled: true,
              required: true,
              prompt: 'Explain why.',
              acceptedAnswers: ['a + le', 'a le devient au'],
              validationMode: 'contains',
              feedback: {
                correct: 'Correct.',
                incorrect: 'Mention the contraction.',
                solution: 'A + le devient au.',
              },
            },
            feedback: {
              correct: 'Correct.',
              incorrect: 'Try again.',
              solution: 'Je parle au professeur.',
            },
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText('Preposition'), 'au');
    await user.type(screen.getByLabelText('Explain why.'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText('Geaccepteerde antwoorden')).toBeInTheDocument();
    expect(screen.getByText('a + le')).toBeInTheDocument();
    expect(screen.getByText('a le devient au')).toBeInTheDocument();
    expect(screen.getByText('Extra uitleg')).toBeInTheDocument();
    expect(screen.getByText('Mention the contraction.')).toBeInTheDocument();
  });

  it('goes to the next question after feedback', async () => {
    const user = userEvent.setup();
    render(<QuestionPager {...labels} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Verdergaan' }));

    expect(screen.getByText('Complète la phrase : Je vais ___ marché.')).toBeInTheDocument();
  });

  it('repeats incorrect questions at the end', async () => {
    const user = userEvent.setup();
    render(<QuestionPager {...labels} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    expect(screen.getByText('Regarde encore le verbe aller.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verdergaan' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(screen.getByText('Herhaalronde')).toBeInTheDocument();
    expect(
      screen.getByText("Quelle est la traduction de 'ik ga' en français ?"),
    ).toBeInTheDocument();
  });

  it('finishes when all questions are correct', async () => {
    const user = userEvent.setup();
    render(<QuestionPager {...labels} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Verdergaan' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(screen.getByText('Klaar')).toBeInTheDocument();
    expect(screen.getByText('Alle vragen zijn juist beantwoord.')).toBeInTheDocument();
  });

  it('calls onClose when the final question is completed without retries', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<QuestionPager {...labels} onClose={onClose} questions={[questions[0]]} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closing starts a retry round', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<QuestionPager {...labels} onClose={onClose} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Verdergaan' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(onClose).not.toHaveBeenCalled();
  });
});
