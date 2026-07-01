import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeedbackBox } from './FeedbackBox';

const meta = {
  title: 'Exercise/FeedbackBox',
  component: FeedbackBox,
  tags: ['autodocs'],
  args: {
    correctTitle: 'Correct',
    incorrectTitle: 'Incorrect',
    isCorrect: true,
    message: 'Tres bien.',
    solution: 'Je vais au marche.',
    solutionTitle: 'Solution',
  },
} satisfies Meta<typeof FeedbackBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Correct: Story = {};

export const Incorrect: Story = {
  args: {
    isCorrect: false,
    message: 'Regarde la contraction avec le masculin singulier.',
    solution: 'Je vais au marche.',
    explanation: "'A' + 'le' devient 'au'.",
  },
};
