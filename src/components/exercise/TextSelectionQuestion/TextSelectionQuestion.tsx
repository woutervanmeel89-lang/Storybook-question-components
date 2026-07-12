import { QuestionTypography } from '../QuestionTypography';
import styles from './TextSelectionQuestion.module.scss';
import type { TextSelectionQuestionProps } from './component.types';

export function TextSelectionQuestion({
  answer,
  className,
  disabled,
  onChange,
  question,
  validation,
}: TextSelectionQuestionProps) {
  const selectedIds = answer.selectedOptionIds ?? [];
  const classes = [
    styles.question,
    question.selectionUnit === 'word' ? styles.words : styles.sentences,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function toggleOption(optionId: string) {
    const nextIds = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];
    onChange({ ...answer, selectedOptionIds: nextIds });
  }

  return (
    <div className={classes}>
      <QuestionTypography eyebrow="Question">{question.prompt}</QuestionTypography>
      <div
        className={styles.options}
        aria-label="Selecteerbare tekst"
        role="group"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedIds.includes(option.id);
          const fieldValidation = validation?.fields[option.id];
          const isCorrectAnswer = question.correctOptionIds.includes(option.id);
          const feedback = validation
            ? isCorrectAnswer
              ? 'correct'
              : isSelected
                ? 'incorrect'
                : undefined
            : undefined;

          return (
            <button
              aria-pressed={isSelected}
              className={styles.option}
              data-feedback={feedback}
              data-valid={fieldValidation?.isCorrect}
              disabled={disabled}
              key={option.id}
              onClick={() => toggleOption(option.id)}
              type="button"
            >
              {question.selectionUnit === 'sentence' ? (
                <span aria-hidden="true" className={styles.number}>
                  {index + 1}.
                </span>
              ) : null}
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
