import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type {
  ExerciseAnswer,
  FillInTheBlankQuestionData,
} from '../../../types/exercise';
import {
  blankReasoningQuestions,
  fillInTheBlankQuestions,
  multipleBlankQuestions,
} from '../sampleQuestions';
import { FillInTheBlankQuestion } from './FillInTheBlankQuestion';

const meta = {
  title: 'Exercise/FillInTheBlankQuestion',
  component: FillInTheBlankQuestion,
  tags: ['autodocs'],
} satisfies Meta<typeof FillInTheBlankQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

function FillInTheBlankQuestionExample({
  question = fillInTheBlankQuestions[0] as FillInTheBlankQuestionData,
}: {
  question?: FillInTheBlankQuestionData;
}) {
  const [answer, setAnswer] = useState<ExerciseAnswer>({});

  return (
    <FillInTheBlankQuestion
      answer={answer}
      onChange={setAnswer}
      question={question}
      solutionTitle="Oplossing"
    />
  );
}

export const InlineBlank: Story = {
  render: () => <FillInTheBlankQuestionExample />,
};

export const MultipleInlineBlanks: Story = {
  render: () => (
    <FillInTheBlankQuestionExample
      question={multipleBlankQuestions[0] as FillInTheBlankQuestionData}
    />
  ),
};

export const WithReasoningPerBlank: Story = {
  render: () => (
    <FillInTheBlankQuestionExample
      question={blankReasoningQuestions[0] as FillInTheBlankQuestionData}
    />
  ),
};
