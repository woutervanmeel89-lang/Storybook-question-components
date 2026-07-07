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
          solutionTitle="Oplossing"
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
        solutionTitle="Oplossing"
        validation={validation}
      />,
    );

    expect(screen.getByText('Oplossing:')).toBeInTheDocument();
    expect(screen.getByText('au')).toBeInTheDocument();
  });
});
