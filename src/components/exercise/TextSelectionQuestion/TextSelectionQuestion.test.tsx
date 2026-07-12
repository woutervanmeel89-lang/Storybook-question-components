import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type {
  ExerciseAnswer,
  TextSelectionQuestionData,
} from '../../../types/exercise';
import { validateQuestion } from '../../../utils';
import { TextSelectionQuestion } from './TextSelectionQuestion';

const question: TextSelectionQuestionData = {
  id: 'selection-1',
  type: 'text-selection',
  prompt: 'Sélectionnez les phrases au discours indirect.',
  selectionUnit: 'sentence',
  options: [
    { id: 'one', text: 'Il me dit qu’il ne veut pas y aller.' },
    { id: 'two', text: 'J’ai peur, dit-elle.' },
    { id: 'three', text: 'Elle prétend qu’elle n’a rien entendu.' },
  ],
  correctOptionIds: ['one', 'three'],
};

describe('TextSelectionQuestion', () => {
  it('selects and deselects individual text options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    function TestComponent() {
      const [answer, setAnswer] = useState<ExerciseAnswer>({});
      return (
        <TextSelectionQuestion
          answer={answer}
          onChange={(next) => {
            setAnswer(next);
            handleChange(next);
          }}
          question={question}
        />
      );
    }

    render(<TestComponent />);
    const option = screen.getByRole('button', { name: /il me dit/i });
    await user.click(option);
    expect(option).toHaveAttribute('aria-pressed', 'true');
    expect(handleChange).toHaveBeenLastCalledWith({ selectedOptionIds: ['one'] });
    await user.click(option);
    expect(option).toHaveAttribute('aria-pressed', 'false');
  });

  it('validates the exact set and shows feedback', () => {
    const answer = { selectedOptionIds: ['one', 'two'] };
    const validation = validateQuestion(question, answer);
    render(
      <TextSelectionQuestion
        answer={answer}
        onChange={() => undefined}
        question={question}
        validation={validation}
      />,
    );

    expect(validation.isCorrect).toBe(false);
    expect(screen.getByRole('button', { name: /j’ai peur/i })).toHaveAttribute(
      'data-feedback',
      'incorrect',
    );
    expect(screen.getByRole('button', { name: /elle prétend/i })).toHaveAttribute(
      'data-feedback',
      'correct',
    );
  });
});
