import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type {
  ExerciseAnswer,
  FillInTheBlankQuestionData,
} from '../../../types/exercise';
import { validateQuestion } from '../../../utils';
import { FillInTheBlankQuestion } from './FillInTheBlankQuestion';

const question: FillInTheBlankQuestionData = {
  id: 'blank-1',
  type: 'fill-in-the-blank',
  prompt: 'Complete la phrase : Je vais ___ marche.',
  blanks: [{ id: 'prep', label: 'Preposition', acceptedAnswers: ['au'] }],
  feedback: {
    correct: 'Correct.',
    incorrect: 'Essaie encore.',
    solution: 'Je vais au marche.',
  },
};

describe('FillInTheBlankQuestion', () => {
  it('captures blank answers', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    function TestComponent() {
      const [answer, setAnswer] = useState<ExerciseAnswer>({});

      return (
        <FillInTheBlankQuestion
          answer={answer}
          onChange={(nextAnswer) => {
            setAnswer(nextAnswer);
            handleChange(nextAnswer);
          }}
          question={question}
        />
      );
    }

    render(<TestComponent />);

    await user.type(screen.getByLabelText('Preposition'), 'au');

    expect(handleChange).toHaveBeenLastCalledWith({ blanks: { prep: 'au' } });
  });

  it('shows validation feedback for an incorrect blank', () => {
    const validation = validateQuestion(question, { blanks: { prep: 'a' } });

    render(
      <FillInTheBlankQuestion
        answer={{ blanks: { prep: 'a' } }}
        onChange={() => undefined}
        question={question}
        validation={validation}
      />,
    );

    expect(screen.getByText('au')).toBeInTheDocument();
    expect(screen.queryByText('Oplossing:')).not.toBeInTheDocument();
    expect(screen.queryByText('Preposition:')).not.toBeInTheDocument();
  });

  it('captures reasoning for a specific blank', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const reasoningQuestion: FillInTheBlankQuestionData = {
      ...question,
      blanks: [
        {
          id: 'prep',
          label: 'Preposition',
          acceptedAnswers: ['au'],
          reasoning: {
            prompt: 'Raisonnement',
            acceptedAnswers: ['a + le'],
          },
        },
      ],
    };

    function TestComponent() {
      const [answer, setAnswer] = useState<ExerciseAnswer>({});

      return (
        <FillInTheBlankQuestion
          answer={answer}
          onChange={(nextAnswer) => {
            setAnswer(nextAnswer);
            handleChange(nextAnswer);
          }}
          question={reasoningQuestion}
        />
      );
    }

    render(<TestComponent />);

    await user.type(screen.getByLabelText('Preposition'), 'au');
    await user.type(screen.getByLabelText('Raisonnement'), 'a + le');

    expect(handleChange).toHaveBeenLastCalledWith({
      blanks: { prep: 'au' },
      blankReasonings: { prep: 'a + le' },
    });
  });

  it('shows validation feedback for incorrect blank reasoning', () => {
    const reasoningQuestion: FillInTheBlankQuestionData = {
      ...question,
      blanks: [
        {
          id: 'prep',
          label: 'Preposition',
          acceptedAnswers: ['au'],
          reasoning: {
            prompt: 'Raisonnement',
            acceptedAnswers: ['a + le'],
            validationMode: 'contains',
          },
        },
      ],
    };
    const validation = validateQuestion(reasoningQuestion, {
      blanks: { prep: 'au' },
      blankReasonings: { prep: 'wrong' },
    });

    render(
      <FillInTheBlankQuestion
        answer={{ blanks: { prep: 'au' }, blankReasonings: { prep: 'wrong' } }}
        onChange={() => undefined}
        question={reasoningQuestion}
        validation={validation}
      />,
    );

    expect(screen.getByText('a + le')).toBeInTheDocument();
    expect(screen.queryByText('Mentionne la contraction.')).not.toBeInTheDocument();
    expect(screen.queryByText('De uitleg is nog niet juist.')).not.toBeInTheDocument();
  });
});
