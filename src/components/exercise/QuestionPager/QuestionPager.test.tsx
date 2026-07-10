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
  },
  {
    id: 'second',
    type: 'fill-in-the-blank',
    prompt: 'Complète la phrase : Je vais ___ marché.',
    blanks: [{ id: 'prep', label: 'Préposition', acceptedAnswers: ['au'] }],
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
  repeatRoundLabel: 'Herhaalronde',
};

describe('QuestionPager', () => {
  it('shows the first question', () => {
    render(<QuestionPager {...labels} questions={questions} />);

    expect(
      screen.getByText("Quelle est la traduction de 'ik ga' en français ?"),
    ).toBeInTheDocument();
  });

  it('does not show global feedback after submit', async () => {
    const user = userEvent.setup();
    render(<QuestionPager {...labels} questions={questions} />);

    await user.type(screen.getByLabelText('Réponse'), 'je vais');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.queryByText('Très bien.')).not.toBeInTheDocument();
    expect(screen.queryByText('Juist')).not.toBeInTheDocument();
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
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText('Verbe'), 'allons');
    await user.type(screen.getByLabelText('Preposition'), 'au');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText('a la')).toBeInTheDocument();
    expect(screen.queryByText('Oplossing:')).not.toBeInTheDocument();
    expect(screen.queryByText('Preposition:')).not.toBeInTheDocument();
    expect(screen.queryByText('Verbe: allons')).not.toBeInTheDocument();
  });

  it('keeps reasoning feedback inline after incorrect reasoning', async () => {
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
              prompt: 'Explain why.',
              acceptedAnswers: ['a + le', 'a le devient au'],
              validationMode: 'contains',
            },
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText('Preposition'), 'au');
    await user.type(screen.getByLabelText('Explain why.'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Verifiëren' }));

    expect(screen.getByText('a + le / a le devient au')).toBeInTheDocument();
    expect(screen.queryByText('Geaccepteerde antwoorden')).not.toBeInTheDocument();
    expect(screen.queryByText('Extra uitleg')).not.toBeInTheDocument();
    expect(screen.queryByText('Mention the contraction.')).not.toBeInTheDocument();
    expect(screen.queryByText('De uitleg is nog niet juist.')).not.toBeInTheDocument();
    expect(screen.queryByText('Try again.')).not.toBeInTheDocument();
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
    expect(screen.queryByText('Regarde encore le verbe aller.')).not.toBeInTheDocument();
    expect(screen.getByText('je vais')).toBeInTheDocument();

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

