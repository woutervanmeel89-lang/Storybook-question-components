import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  blankReasoningQuestions,
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
  feedbackCorrectTitle: 'Juist',
  feedbackIncorrectTitle: 'Nog niet juist',
  feedbackSolutionTitle: 'Oplossing',
  reasoningLabels: {
    acceptedAnswersTitle: 'Geaccepteerde antwoorden',
    correctFallback: 'De uitleg is juist.',
    feedbackTitle: 'Extra uitleg',
    incorrectFallback: 'De uitleg is nog niet juist.',
    solutionTitle: 'Voorbeeld',
  },
  repeatRoundLabel: 'Herhaalronde',
};

export const ShortAnswerOnly: Story = {
  args: {
    ...labels,
    questions: shortAnswerQuestions,
  },
};

export const FillInTheBlankOnly: Story = {
  args: {
    ...labels,
    questions: fillInTheBlankQuestions,
  },
};

export const MixedQuestionTypes: Story = {
  args: {
    ...labels,
    questions: mixedQuestions,
  },
};

export const WithReasoning: Story = {
  args: {
    ...labels,
    questions: reasoningQuestions,
  },
};

export const WithReasoningPerBlank: Story = {
  args: {
    ...labels,
    questions: blankReasoningQuestions,
  },
};

export const RetryIncorrectAnswers: Story = {
  args: {
    ...labels,
    questions: retryQuestions,
  },
};
