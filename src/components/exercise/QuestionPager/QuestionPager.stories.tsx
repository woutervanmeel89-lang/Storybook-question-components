import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  fillInTheBlankQuestions,
  mixedQuestions,
  reasoningQuestions,
  retryQuestions,
  shortAnswerQuestions,
} from '../sampleQuestions';
import { QuestionPager } from './QuestionPager';

const meta = {
  title: 'Exercise/QuestionPager',
  component: QuestionPager,
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionPager>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ShortAnswerOnly: Story = {
  args: {
    questions: shortAnswerQuestions,
  },
};

export const FillInTheBlankOnly: Story = {
  args: {
    questions: fillInTheBlankQuestions,
  },
};

export const MixedQuestionTypes: Story = {
  args: {
    questions: mixedQuestions,
  },
};

export const WithReasoning: Story = {
  args: {
    questions: reasoningQuestions,
  },
};

export const RetryIncorrectAnswers: Story = {
  args: {
    questions: retryQuestions,
  },
};
