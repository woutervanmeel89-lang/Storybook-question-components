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

describe('QuestionPager', () => {
  it('shows the first question', () => {
    render(<QuestionPager questions={questions} />);

    expect(
      screen.getByText("Quelle est la traduction de 'ik ga' en français ?"),
    ).toBeInTheDocument();
  });

  it('shows feedback after submit', async () => {
    const user = userEvent.setup();
    render(<QuestionPager questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));

    expect(screen.getByText('Très bien.')).toBeInTheDocument();
  });

  it('goes to the next question after feedback', async () => {
    const user = userEvent.setup();
    render(<QuestionPager questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Volgende' }));

    expect(screen.getByText('Complète la phrase : Je vais ___ marché.')).toBeInTheDocument();
  });

  it('repeats incorrect questions at the end', async () => {
    const user = userEvent.setup();
    render(<QuestionPager questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    expect(screen.getByText('Regarde encore le verbe aller.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Volgende' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(screen.getByText('Herhaalronde')).toBeInTheDocument();
    expect(
      screen.getByText("Quelle est la traduction de 'ik ga' en français ?"),
    ).toBeInTheDocument();
  });

  it('finishes when all questions are correct', async () => {
    const user = userEvent.setup();
    render(<QuestionPager questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Volgende' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(screen.getByText('Klaar')).toBeInTheDocument();
    expect(screen.getByText('Alle vragen zijn juist beantwoord.')).toBeInTheDocument();
  });

  it('calls onClose when the final question is completed without retries', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<QuestionPager onClose={onClose} questions={[questions[0]]} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closing starts a retry round', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<QuestionPager onClose={onClose} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Volgende' }));
    await user.type(screen.getByLabelText('Préposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Controleren' }));
    await user.click(screen.getByRole('button', { name: 'Afsluiten' }));

    expect(onClose).not.toHaveBeenCalled();
  });
});
