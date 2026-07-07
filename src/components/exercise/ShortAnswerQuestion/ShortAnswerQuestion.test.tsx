import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { ExerciseAnswer, ShortAnswerQuestionData } from '../../../types/exercise';
import { validateQuestion } from '../../../utils';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';

const question: ShortAnswerQuestionData = {
  id: 'short-1',
  type: 'short-answer',
  prompt: "Quelle est la traduction de 'ik ga' en francais ?",
  acceptedAnswers: ['je vais', "j'y vais"],
  feedback: {
    correct: 'Correct.',
    incorrect: 'Essaie encore.',
    solution: 'Je vais',
  },
};

describe('ShortAnswerQuestion', () => {
  it('captures a correct short answer', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    function TestComponent() {
      const [answer, setAnswer] = useState<ExerciseAnswer>({});

      return (
        <ShortAnswerQuestion
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

    await user.type(screen.getByLabelText(/ponse/i), 'je vais');

    expect(handleChange).toHaveBeenLastCalledWith({ shortAnswer: 'je vais' });
  });

  it('shows validation feedback for an incorrect answer', () => {
    const validation = validateQuestion(question, { shortAnswer: 'je suis' });

    render(
      <ShortAnswerQuestion
        answer={{ shortAnswer: 'je suis' }}
        onChange={() => undefined}
        question={question}
        solutionTitle="Oplossing"
        validation={validation}
      />,
    );

    expect(screen.getByText('Oplossing:')).toBeInTheDocument();
    expect(screen.getByText("je vais / j'y vais")).toBeInTheDocument();
  });
});
