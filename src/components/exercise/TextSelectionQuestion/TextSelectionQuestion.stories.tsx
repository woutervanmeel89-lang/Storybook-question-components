import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type {
  ExerciseAnswer,
  QuestionValidationResult,
  TextSelectionQuestionData,
} from '../../../types/exercise';
import { validateQuestion } from '../../../utils';
import { NextButton } from '../NextButton';
import { textSelectionQuestions } from '../sampleQuestions';
import { TextSelectionQuestion } from './TextSelectionQuestion';

const meta = {
  title: 'Exercise/TextSelectionQuestion',
  component: TextSelectionQuestion,
  tags: ['autodocs'],
} satisfies Meta<typeof TextSelectionQuestion>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example({ question }: { question: TextSelectionQuestionData }) {
  const [answer, setAnswer] = useState<ExerciseAnswer>({});
  return (
    <TextSelectionQuestion
      answer={answer}
      onChange={setAnswer}
      question={question}
    />
  );
}

function ValidationExample({ question }: { question: TextSelectionQuestionData }) {
  const [answer, setAnswer] = useState<ExerciseAnswer>({});
  const [validation, setValidation] = useState<QuestionValidationResult>();

  function reset() {
    setAnswer({});
    setValidation(undefined);
  }

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <TextSelectionQuestion
        answer={answer}
        disabled={Boolean(validation)}
        onChange={setAnswer}
        question={question}
        validation={validation}
      />
      <div>
        <NextButton
          disabled={!answer.selectedOptionIds?.length}
          onClick={validation ? reset : () => setValidation(validateQuestion(question, answer))}
        >
          {validation ? 'Opnieuw proberen' : 'Controleren'}
        </NextButton>
      </div>
      {validation ? (
        <p aria-live="polite" role="status" style={{ margin: 0 }}>
          {validation.isCorrect
            ? 'Alle selecties zijn correct.'
            : 'Niet helemaal juist. De correcte zinnen zijn groen aangeduid.'}
        </p>
      ) : null}
    </div>
  );
}

export const Sentences: Story = {
  render: () => (
    <Example question={textSelectionQuestions[0] as TextSelectionQuestionData} />
  ),
};

export const WithValidation: Story = {
  render: () => (
    <ValidationExample
      question={textSelectionQuestions[0] as TextSelectionQuestionData}
    />
  ),
};

export const Words: Story = {
  render: () => (
    <Example
      question={{
        id: 'selection-words',
        type: 'text-selection',
        prompt: 'Sélectionnez les verbes.',
        selectionUnit: 'word',
        options: [
          { id: 'elle', text: 'Elle' },
          { id: 'pretend', text: 'prétend' },
          { id: 'que', text: 'qu’elle' },
          { id: 'heard', text: 'a' },
          { id: 'nothing', text: 'rien' },
          { id: 'entendu', text: 'entendu.' },
        ],
        correctOptionIds: ['pretend', 'heard', 'entendu'],
      }}
    />
  ),
};
