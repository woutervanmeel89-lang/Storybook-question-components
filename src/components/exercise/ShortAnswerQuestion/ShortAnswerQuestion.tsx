import { QuestionTypography } from '../QuestionTypography';
import { ReasoningField } from '../ReasoningField';
import { TextInput } from '../TextInput';
import styles from './ShortAnswerQuestion.module.scss';
import type { ShortAnswerQuestionProps } from './component.types';

export function ShortAnswerQuestion({
  answer,
  className,
  disabled,
  onChange,
  question,
  solutionTitle,
  validation,
}: ShortAnswerQuestionProps) {
  const classes = [styles.question, className].filter(Boolean).join(' ');
  const fieldValidation = validation?.fields.shortAnswer;
  const solutionMessage =
    fieldValidation?.isCorrect === false ? (
      <>
        {solutionTitle}: <strong>{question.acceptedAnswers.join(' / ')}</strong>
      </>
    ) : undefined;

  return (
    <div className={classes}>
      <QuestionTypography eyebrow="Question">{question.prompt}</QuestionTypography>
      <TextInput
        errorMessage={solutionMessage}
        label="Réponse"
        onChange={(shortAnswer) => onChange({ ...answer, shortAnswer })}
        placeholder="Écris ta réponse"
        value={answer.shortAnswer ?? ''}
        disabled={disabled}
      />
      {question.reasoning?.enabled ? (
        <ReasoningField
          reasoning={question.reasoning}
          value={answer.reasoning ?? ''}
          onChange={(reasoning) => onChange({ ...answer, reasoning })}
          validation={validation?.reasoning}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
