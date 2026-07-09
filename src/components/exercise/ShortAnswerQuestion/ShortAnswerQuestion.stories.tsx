import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ExerciseAnswer } from '../../../types/exercise';
import { shortAnswerQuestions } from '../sampleQuestions';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';

const meta = {
  title: 'Exercise/ShortAnswerQuestion',
  component: ShortAnswerQuestion,
  tags: ['autodocs'],
} satisfies Meta<typeof ShortAnswerQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

function ShortAnswerQuestionExample() {
  const [answer, setAnswer] = useState<ExerciseAnswer>({});

  return (
    <ShortAnswerQuestion
      answer={answer}
      onChange={setAnswer}
      question={shortAnswerQuestions[0]}
    />
  );
}

export const Default: Story = {
  render: () => <ShortAnswerQuestionExample />,
};
